import crypto from "crypto";

type RequestToPayInput = {
  amount: number;
  phone: string;
  customerName: string;
  serviceName: string;
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
  message: string;
};

// MTN MADAPI – Production: https://api.mtn.com/v1
// Token URL (per portal): POST /oauth/access_token  (Client Credentials flow)
const baseUrl = process.env.MTN_MOMO_BASE_URL || "https://api.mtn.com/v1";

// Consumer Key  → used as OAuth2 client_id  (was incorrectly called "API User")
const consumerKey = process.env.MTN_MOMO_API_USER;
// Consumer Secret → used as OAuth2 client_secret  (was incorrectly called "API Key")
const consumerSecret = process.env.MTN_MOMO_API_KEY;

// Optional – only required if your subscription enforces the Ocp-Apim-Subscription-Key header
const subscriptionKey = process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY;

// Company MoMo number — all payments are directed to this account
const merchantNumber = process.env.MTN_MOMO_MERCHANT_NUMBER;

const targetEnvironment = process.env.MTN_MOMO_TARGET_ENVIRONMENT || "production";

// Live mode requires consumer key + secret + company MoMo number
const hasLiveConfig = Boolean(consumerKey && consumerSecret && merchantNumber);

const sanitizePhone = (phone: string) => phone.replace(/[^\d]/g, "");

/**
 * Fetches an OAuth2 Bearer token using Client Credentials grant.
 * Token URL: POST {baseUrl}/oauth/access_token
 * Auth: Basic base64(consumerKey:consumerSecret)
 * Body: grant_type=client_credentials  (application/x-www-form-urlencoded)
 */
const getToken = async (): Promise<string> => {
  if (!consumerKey || !consumerSecret) {
    throw new Error("MTN MoMo credentials are not configured (MTN_MOMO_API_USER / MTN_MOMO_API_KEY).");
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const headers: Record<string, string> = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  // Include subscription key header only when provided
  if (subscriptionKey) {
    headers["Ocp-Apim-Subscription-Key"] = subscriptionKey;
  }

  const response = await fetch(`${baseUrl}/oauth/access_token`, {
    method: "POST",
    headers,
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`MTN token request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as MtnTokenResponse;

  if (!data.access_token) {
    throw new Error("MTN token response did not include an access_token.");
  }

  return data.access_token;
};

/** Thrown when MoMo credentials are missing, so callers can say so specifically. */
export class MtnNotConfiguredError extends Error {
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
  if (!hasLiveConfig) throw new MtnNotConfiguredError();

  const referenceId = crypto.randomUUID();
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
      currency: process.env.MTN_MOMO_CURRENCY || "GHS",
      externalId: referenceId,
      payer: {
        partyIdType: "MSISDN",
        partyId: sanitizePhone(input.phone),       // customer paying
      },
      payee: {
        partyIdType: "MSISDN",
        partyId: sanitizePhone(merchantNumber!),   // company MoMo account receives
      },
      payerMessage: `Erniekay booking: ${input.serviceName}`,
      payeeNote: `Booking payment for ${input.customerName}`,
    }),
  });

  if (!response.ok && response.status !== 202) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`MTN MoMo request-to-pay failed (${response.status}): ${errorText}`);
  }

  return {
    referenceId,
    status: "PENDING",
    mode: "live",
    message: "MTN Mobile Money prompt sent. Ask the client to approve it on their phone.",
  };
}

export async function getMtnPaymentStatus(referenceId: string): Promise<MtnPaymentResult> {
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
    throw new Error(`MTN MoMo status check failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as { status?: MtnPaymentResult["status"] };

  return {
    referenceId,
    status: data.status || "PENDING",
    mode: "live",
    message: `MTN MoMo payment status: ${data.status || "PENDING"}.`,
  };
}
