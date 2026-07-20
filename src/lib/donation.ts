/**
 * Shared donation-amount rules, used by both the client-side donation form and
 * the Razorpay route handler so the two can never disagree.
 */

export const MIN_DONATION = 1;
export const MAX_DONATION = 500000;

/**
 * Coerce an untrusted value into a valid donation amount in rupees.
 * Returns null when the value isn't a positive number within the allowed range.
 */
export function parseDonationAmount(value: unknown): number | null {
  const raw = typeof value === "string" ? value.trim() : value;

  // Reject "", null, undefined, booleans, arrays, objects — Number() coerces
  // several of these to 0 or NaN silently, so guard the type first.
  if (raw === "" || raw === null || raw === undefined) return null;
  if (typeof raw !== "number" && typeof raw !== "string") return null;

  const amount = Number(raw);
  if (!Number.isFinite(amount)) return null;
  if (amount < MIN_DONATION || amount > MAX_DONATION) return null;

  // Money is charged in paise; keep at most 2 decimal places.
  return Math.round(amount * 100) / 100;
}

/** Human-readable reason an amount was rejected, or null when it's valid. */
export function validateDonationAmount(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Please enter an amount.";
  if (!/^\d*\.?\d*$/.test(trimmed)) return "Enter numbers only.";

  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount <= 0) return "Enter an amount greater than 0.";
  if (amount < MIN_DONATION) return `Minimum donation is ₹${MIN_DONATION}.`;
  if (amount > MAX_DONATION)
    return `Maximum donation is ₹${MAX_DONATION.toLocaleString("en-IN")}.`;

  return null;
}
