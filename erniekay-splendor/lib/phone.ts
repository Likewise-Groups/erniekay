/**
 * Ghanaian MSISDN normalisation and validation.
 *
 * request-to-pay sends a real MoMo collection prompt to whatever number it is
 * given. Unvalidated, that is a harassment and phishing vector: an attacker can
 * push "Erniekay booking" prompts at arbitrary handsets all day. Rejecting
 * anything that is not a plausible Ghanaian mobile number removes most of the
 * value of doing so, before any MTN call is made.
 */

/**
 * Mobile network codes in use in Ghana (the digits after the 233 country code).
 * MTN: 24 25 53 54 55 59. Vodafone/Telecel: 20 50. AirtelTigo: 26 27 56 57.
 *
 * Non-MTN prefixes are accepted: MoMo collections can be initiated against
 * them, and rejecting a customer because of their network is a support problem,
 * not a security one.
 */
const GH_MOBILE_PREFIXES = new Set([
  "20", "23", "24", "25", "26", "27", "28", "29",
  "50", "53", "54", "55", "56", "57", "59",
]);

export type PhoneResult =
  | { ok: true; msisdn: string }
  | { ok: false; reason: string };

/**
 * Normalises to bare international form (233XXXXXXXXX, 12 digits).
 *
 * Accepts the shapes customers actually type: +233 24 123 4567, 0241234567,
 * 233241234567, with spaces, dashes or brackets.
 */
export function normalizeGhanaPhone(input: string): PhoneResult {
  const digits = String(input || "").replace(/\D/g, "");

  if (!digits) return { ok: false, reason: "Phone number is required." };

  let national: string;

  if (digits.startsWith("233")) {
    national = digits.slice(3);
  } else if (digits.startsWith("0")) {
    // Local form: drop the trunk prefix.
    national = digits.slice(1);
  } else if (digits.length === 9) {
    // Already national significant number, e.g. pasted without the leading 0.
    national = digits;
  } else {
    return { ok: false, reason: "Enter a Ghanaian mobile number (e.g. 024 123 4567)." };
  }

  if (national.length !== 9) {
    return { ok: false, reason: "A Ghanaian mobile number has 9 digits after the 0." };
  }

  if (!GH_MOBILE_PREFIXES.has(national.slice(0, 2))) {
    return { ok: false, reason: "That is not a recognised Ghanaian mobile network prefix." };
  }

  return { ok: true, msisdn: `233${national}` };
}
