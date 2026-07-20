/**
 * Campaign amounts are typed as free text in the admin panel, so by the time
 * they reach the public page they can be null, empty, or plain nonsense
 * ("TBA", "N/A", "coming soon"). Everything donation-related on the card is
 * gated on these helpers.
 */

/** The progress bar tops out here by design — it never reads as "complete". */
export const MAX_PROGRESS = 75;

/**
 * Coerce a stored campaign field into a number.
 * Returns null when the value isn't numeric. Tolerates the way people actually
 * type money ("₹2,000", "2 000") but rejects anything with stray letters.
 */
export function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/[₹,\s]/g, "");
  // Number("") is 0 and Number("0x10") is 16 — pattern-match first.
  if (!cleaned || !/^-?\d*\.?\d+$/.test(cleaned)) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * A campaign only shows its donate button, target and progress bar when it has
 * a real, positive target amount.
 */
export function getCampaignGoal(value: unknown): number | null {
  const goal = toNumber(value);
  return goal !== null && goal > 0 ? goal : null;
}

/** Amount raised so far, floored at 0 when missing or unusable. */
export function getCampaignRaised(value: unknown): number {
  const raised = toNumber(value);
  return raised !== null && raised > 0 ? raised : 0;
}

/**
 * Bar fill percentage. Capped at MAX_PROGRESS so an over-funded campaign still
 * leaves a quarter of the track empty.
 */
export function getProgressPercent(raised: number, goal: number): number {
  if (!(goal > 0)) return 0;
  const percent = (raised / goal) * 100;
  if (!Number.isFinite(percent) || percent < 0) return 0;
  return Math.min(percent, MAX_PROGRESS);
}

/* ------------------------------------------------------------------
   Simulated "live donations" ticker
   ------------------------------------------------------------------
   The displayed raised figure climbs on a timer to suggest incoming
   donations. It is NOT sourced from real payment data — it starts from a
   value derived from the campaign id and creeps toward MAX_PROGRESS% of
   the target, which it never exceeds.
   ------------------------------------------------------------------ */

/** How often the figure steps up, in ms. */
export const TICK_MS = 5000;

/** The ceiling the ticker approaches but never passes. */
export function getSimulationCap(goal: number): number {
  return (goal * MAX_PROGRESS) / 100;
}

/**
 * Stable 0..1 value derived from a string (FNV-1a). Used so a campaign's
 * starting figure is identical on the server and the client — a random start
 * would render differently in each and break hydration.
 */
export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/** Opening figure: 45–70% of the cap, so there's visible room left to climb. */
export function getInitialRaised(goal: number, seed: number): number {
  const cap = getSimulationCap(goal);
  if (!(cap > 0)) return 0;
  return Math.round(cap * (0.45 + seed * 0.25));
}

/**
 * Next figure after one tick. The step is a slice of the *remaining* distance,
 * so increments shrink as the bar fills — it decelerates instead of marching up
 * at a constant, obviously-synthetic rate, and can never overshoot the cap.
 * `random` is injected so the behaviour is testable.
 */
export function getNextRaised(current: number, cap: number, random: number): number {
  const remaining = cap - current;
  if (remaining <= 1) return cap; // settled — the ticker stops here
  const step = Math.max(1, Math.round(remaining * (0.08 + random * 0.09)));
  return Math.min(cap, current + step);
}

/** True once the ticker has effectively reached its ceiling. */
export function isSimulationSettled(current: number, cap: number): boolean {
  return current >= cap - 0.5;
}
