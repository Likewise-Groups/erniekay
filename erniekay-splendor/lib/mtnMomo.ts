import crypto from "crypto";

type RequestToPayInput = {
  amount: number;
  phone: string;
  customerName: string;
  serviceName: string;
  /**
   * Caller-supplied X-Reference-Id. Passing one lets the caller record the
   * payment BEFORE money is requested, so a failed insert can abort the
   * collection instead of leaving MTN holding a transaction the system has no
   * row for. Generated here only when omitted.
   */
  referenceId?: string;
};

type MtnTokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
};

export type MtnPaymentResult = {
  referenceId: string;
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  mode: "live" | "sandbox";
  /** What was actually charged — not what MTN_MOMO_CURRENCY says, which sandbox overrides. */
  currency: string;
  message: string;
};

// MTN MoMo Developer API (Collections product).
//   Production: https://proxy.momoapi.mtn.com
//   Sandbox:    https://sandbox.momodeveloper.mtn.com
//
// consumerKey/consumerSecret are the MoMo "API user" and "API key" — NOT the
// portal login, and not MADAPI consumer credentials.
//
// Read per call, never at module scope: on Cloudflare Workers process.env is
// populated per request, so module-level reads run before the secrets exist and
// would pin hasLiveConfig to false no matter what is configured.
function getConfig() {
  const targetEnvironment = process.env.MTN_MOMO_TARGET_ENVIRONMENT || "production";

  const config = {
    // Derived from the target environment so the two cannot drift apart. Pointing
    // a sandbox credential set at the production proxy gets a 401 "invalid
    // subscription key", which reads like bad keys rather than a wrong host.
    baseUrl:
      process.env.MTN_MOMO_BASE_URL ||
      (targetEnvironment === "sandbox"
        ? "https://sandbox.momodeveloper.mtn.com"
        : "https://proxy.momoapi.mtn.com"),
    // MoMo "API user" — the Basic auth username for the token call
    consumerKey: process.env.MTN_MOMO_API_USER,
    // MoMo "API key" — the Basic auth password for the token call
    consumerSecret: process.env.MTN_MOMO_API_KEY,
    // Only required if the subscription enforces Ocp-Apim-Subscription-Key
    subscriptionKey: process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY,
    // Company MoMo number. Informational only — see the payee note in
    // requestMtnPayment; Collections does not route funds by this value.
    merchantNumber: process.env.MTN_MOMO_MERCHANT_NUMBER,
    targetEnvironment,
    // Sandbox Collections accepts EUR and nothing else — a GHS request comes
    // back as 500 INVALID_CURRENCY. Forced here rather than left to config so
    // MTN_MOMO_CURRENCY can hold the real production currency at all times
    // instead of having to be flipped in lockstep with the environment.
    currency:
      targetEnvironment === "sandbox" ? "EUR" : process.env.MTN_MOMO_CURRENCY || "GHS",
  };

  return {
    ...config,
    // Live mode requires consumer key + secret + company MoMo number
    hasLiveConfig: Boolean(config.consumerKey && config.consumerSecret && config.merchantNumber),
  };
}

const sanitizePhone = (phone: string) => phone.replace(/[^\d]/g, "");

/**
 * Strips characters MoMo silently rejects from payerMessage / payeeNote.
 *
 * Verified against the sandbox on 2026-08-10: a request whose narrative
 * contains any of & ( ) * ' # % ! ? " < > comes back 200 instead of 202, and
 * the transaction is never created — a later status lookup 404s. The response
 * body is empty either way, so this fails silently unless the status code is
 * checked strictly (see requestMtnPayment).
 *
 * This bites real data: two catalogue titles contain "&" ("Nail Care &
 * Artistry", "SPA & Skin Rejuvenation"), and any customer named O'Brien would
 * have hit it via payeeNote.
 *
 * Accepted alongside letters, digits and spaces: / + , . - : @
 */
const sanitizeNarrative = (text: string) =>
  text
    .replace(/&/g, "and")
    .replace(/[^A-Za-z0-9 /+,.:@-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    // MoMo caps these fields at 160 characters.
    .slice(0, 160);

/**
 * Fetches a Bearer token from the MoMo Collections API.
 *
 * Token URL: POST {baseUrl}/collection/token/
 * Auth: Basic base64(apiUser:apiKey)
 * Header: Ocp-Apim-Subscription-Key (the Collections subscription's primary key)
 *
 * This deliberately matches the MoMo Developer API, the same family as the
 * /collection/v1_0/ payment calls below. It previously posted an OAuth2
 * client_credentials grant to /oauth/access_token, which belongs to MTN's
 * separate MADAPI product and returned 400 against a MoMo subscription.
 */
const getToken = async (): Promise<string> => {
  const { baseUrl, consumerKey, consumerSecret, subscriptionKey } = getConfig();

  if (!consumerKey || !consumerSecret) {
    throw new MtnNotConfiguredError();
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const headers: Record<string, string> = {
    Authorization: `Basic ${credentials}`,
  };

  // Include subscription key header only when provided
  if (subscriptionKey) {
    headers["Ocp-Apim-Subscription-Key"] = subscriptionKey;
  }

  const response = await fetch(`${baseUrl}/collection/token/`, {
    method: "POST",
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    // Credentials rejected or the API is down. Treated as unavailable rather
    // than a crash, so the customer is told to use another method instead of
    // seeing a generic failure.
    throw new MtnUnavailableError(`MTN token request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as MtnTokenResponse;

  if (!data.access_token) {
    throw new Error("MTN token response did not include an access_token.");
  }

  return data.access_token;
};

/**
 * MoMo cannot currently take a payment — missing configuration, rejected
 * credentials, or MTN being unreachable. Callers turn this into a 503 telling
 * the customer to use another method, rather than a generic failure.
 */
export class MtnUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MtnUnavailableError";
  }
}

/** Thrown when MoMo credentials are missing entirely. */
export class MtnNotConfiguredError extends MtnUnavailableError {
  constructor() {
    super(
      "MTN Mobile Money is not configured. Set MTN_MOMO_API_USER, MTN_MOMO_API_KEY and MTN_MOMO_MERCHANT_NUMBER.",
    );
    this.name = "MtnNotConfiguredError";
  }
}

// Mock mode is disabled on purpose. It reported every payment as SUCCESSFUL
// without contacting MTN, so a customer saw a confirmation and no money moved
// and no prompt reached their phone. Missing credentials must fail loudly.
//
// const createMockPayment = (input: RequestToPayInput): MtnPaymentResult => ({
//   referenceId: `MOCK-MTN-${Date.now()}`,
//   status: "SUCCESSFUL",
//   mode: "sandbox",
//   message: `Sandbox MoMo payment recorded for ${input.customerName}. Add MTN credentials to send a real phone approval prompt.`,
// });

export async function requestMtnPayment(input: RequestToPayInput): Promise<MtnPaymentResult> {
  const { baseUrl, subscriptionKey, merchantNumber, targetEnvironment, currency, hasLiveConfig } =
    getConfig();

  if (!hasLiveConfig) throw new MtnNotConfiguredError();

  const referenceId = input.referenceId ?? crypto.randomUUID();
  const token = await getToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Reference-Id": referenceId,
    "X-Target-Environment": targetEnvironment,
  };

  if (subscriptionKey) {
    headers["Ocp-Apim-Subscription-Key"] = subscriptionKey;
  }

  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      amount: input.amount.toFixed(2),
      currency,
      externalId: referenceId,
      payer: {
        partyIdType: "MSISDN",
        partyId: sanitizePhone(input.phone),       // customer paying
      },
      // Collections has no payee field — MoMo ignores this and credits whichever
      // account the API user is provisioned against. Verified in sandbox: the
      // same call succeeds identically with and without it. Kept only so the
      // intended destination is visible in request logs; changing
      // MTN_MOMO_MERCHANT_NUMBER does NOT redirect funds.
      payee: {
        partyIdType: "MSISDN",
        partyId: sanitizePhone(merchantNumber!),
      },
      payerMessage: sanitizeNarrative(`Erniekay booking: ${input.serviceName}`),
      payeeNote: sanitizeNarrative(`Booking payment for ${input.customerName}`),
    }),
  });

  // Strictly 202. MoMo answers 202 Accepted when it has actually created the
  // transaction; a 200 means it took the request and discarded it, which is
  // what a bad character in payerMessage/payeeNote produces. Treating any 2xx
  // as success returned a referenceId MTN had never heard of, so the customer
  // got no prompt, no money moved, and the booking waited on a payment that
  // could never arrive.
  if (response.status !== 202) {
    const errorText = await response.text().catch(() => "");
    throw new MtnUnavailableError(
      `MTN MoMo request-to-pay failed (${response.status}): ${errorText}`,
    );
  }

  // Derived, not hardcoded. Sandbox auto-approves every request without ever
  // reaching a handset, so reporting it as "live" would have staff telling a
  // customer to approve a prompt that was never sent.
  const mode = targetEnvironment === "sandbox" ? "sandbox" : "live";

  return {
    referenceId,
    status: "PENDING",
    mode,
    currency,
    message:
      mode === "live"
        ? "MTN Mobile Money prompt sent. Ask the client to approve it on their phone."
        : "Sandbox MoMo request accepted. No prompt was sent and no money moved.",
  };
}

export async function getMtnPaymentStatus(referenceId: string): Promise<MtnPaymentResult> {
  const { baseUrl, subscriptionKey, targetEnvironment, currency, hasLiveConfig } = getConfig();

  // Mock mode disabled — see requestMtnPayment. Previously returned SUCCESSFUL
  // for any reference id, which would confirm a payment that never happened.
  if (!hasLiveConfig) throw new MtnNotConfiguredError();

  const token = await getToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "X-Target-Environment": targetEnvironment,
  };

  if (subscriptionKey) {
    headers["Ocp-Apim-Subscription-Key"] = subscriptionKey;
  }

  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new MtnUnavailableError(
      `MTN MoMo status check failed (${response.status}): ${errorText}`,
    );
  }

  const data = (await response.json()) as {
    status?: MtnPaymentResult["status"];
    currency?: string;
  };

  return {
    referenceId,
    status: data.status || "PENDING",
    mode: targetEnvironment === "sandbox" ? "sandbox" : "live",
    // MTN echoes the currency the transaction was actually created with, which
    // is the authoritative value if config has changed since.
    currency: data.currency || currency,
    message: `MTN MoMo payment status: ${data.status || "PENDING"}.`,
  };
}
