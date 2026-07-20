import crypto from "crypto";

type RequestToPayInput = {
  amount: number;
  phone: string;
  customerName: string;
  serviceName: string;
};

type MtnTokenResponse = {
  access_token: string;
};

export type MtnPaymentResult = {
  referenceId: string;
  status: "PENDING" | "SUCCESSFUL" | "FAILED";
  mode: "live" | "sandbox";
  message: string;
};

const baseUrl = process.env.MTN_MOMO_BASE_URL || "https://sandbox.momodeveloper.mtn.com";
const subscriptionKey = process.env.MTN_MOMO_COLLECTION_SUBSCRIPTION_KEY;
const apiUser = process.env.MTN_MOMO_API_USER;
const apiKey = process.env.MTN_MOMO_API_KEY;
const targetEnvironment = process.env.MTN_MOMO_TARGET_ENVIRONMENT || "sandbox";

const hasLiveConfig = Boolean(subscriptionKey && apiUser && apiKey);

const sanitizePhone = (phone: string) => phone.replace(/[^\d]/g, "");

const getToken = async () => {
  if (!subscriptionKey || !apiUser || !apiKey) {
    throw new Error("MTN MoMo credentials are not configured.");
  }

  const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString("base64");
  const response = await fetch(`${baseUrl}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
    },
  });

  if (!response.ok) {
    throw new Error("MTN MoMo token request failed.");
  }

  const data = (await response.json()) as MtnTokenResponse;
  return data.access_token;
};

const createMockPayment = (input: RequestToPayInput): MtnPaymentResult => ({
  referenceId: `MOCK-MTN-${Date.now()}`,
  status: "SUCCESSFUL",
  mode: "sandbox",
  message: `Sandbox MoMo payment recorded for ${input.customerName}. Add MTN credentials to send a real phone approval prompt.`,
});

export async function requestMtnPayment(input: RequestToPayInput): Promise<MtnPaymentResult> {
  if (!hasLiveConfig) return createMockPayment(input);

  const referenceId = crypto.randomUUID();
  const token = await getToken();

  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Reference-Id": referenceId,
      "X-Target-Environment": targetEnvironment,
      "Ocp-Apim-Subscription-Key": subscriptionKey as string,
    },
    body: JSON.stringify({
      amount: input.amount.toFixed(2),
      currency: process.env.MTN_MOMO_CURRENCY || "GHS",
      externalId: referenceId,
      payer: {
        partyIdType: "MSISDN",
        partyId: sanitizePhone(input.phone),
      },
      payerMessage: `Erniekay booking: ${input.serviceName}`,
      payeeNote: `Booking payment for ${input.customerName}`,
    }),
  });

  if (!response.ok && response.status !== 202) {
    throw new Error("MTN MoMo request-to-pay failed.");
  }

  return {
    referenceId,
    status: "PENDING",
    mode: "live",
    message: "MTN Mobile Money prompt sent. Ask the client to approve it on their phone.",
  };
}

export async function getMtnPaymentStatus(referenceId: string): Promise<MtnPaymentResult> {
  if (!hasLiveConfig) {
    return {
      referenceId,
      status: "SUCCESSFUL",
      mode: "sandbox",
      message: "Sandbox payment marked successful.",
    };
  }

  const token = await getToken();
  const response = await fetch(`${baseUrl}/collection/v1_0/requesttopay/${referenceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Target-Environment": targetEnvironment,
      "Ocp-Apim-Subscription-Key": subscriptionKey as string,
    },
  });

  if (!response.ok) {
    throw new Error("MTN MoMo payment status check failed.");
  }

  const data = (await response.json()) as { status?: MtnPaymentResult["status"] };

  return {
    referenceId,
    status: data.status || "PENDING",
    mode: "live",
    message: `MTN MoMo payment status: ${data.status || "PENDING"}.`,
  };
}
