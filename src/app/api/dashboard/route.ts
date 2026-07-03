import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import clientPromise from "../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // always real-time, never cached

/* Minimal shape of the fields we use from a Razorpay payment. */
interface RzpPayment {
  id: string;
  amount: number; // paise
  currency: string;
  status: string; // created | authorized | captured | refunded | failed
  method?: string;
  email?: string;
  contact?: string;
  created_at: number; // unix seconds
  description?: string;
}

/* Fetch every payment on the account, paginated (Razorpay caps count at 100). */
async function fetchAllPayments(): Promise<RzpPayment[]> {
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const all: RzpPayment[] = [];
  const pageSize = 100;
  const maxPages = 20; // safety cap (2000 payments) to bound API cost

  for (let page = 0; page < maxPages; page++) {
    const res = await razorpay.payments.all({
      count: pageSize,
      skip: page * pageSize,
    });
    const items = (res.items || []) as unknown as RzpPayment[];
    all.push(...items);
    if (items.length < pageSize) break;
  }
  return all;
}

export async function GET() {
  /* ---- MongoDB counts ---- */
  let campaigns = 0;
  let programs = 0;
  let teamMembers = 0;
  let users = 0;
  let mongoError = false;

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "VOV");
    [campaigns, programs, teamMembers, users] = await Promise.all([
      db.collection("campaigns").countDocuments(),
      db.collection("programs").countDocuments(),
      db.collection("team").countDocuments(),
      db.collection("users").countDocuments(),
    ]);
  } catch (e) {
    console.error("❌ Dashboard Mongo error:", e);
    mongoError = true;
  }

  const now = new Date();
  const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

  /* ---- Razorpay aggregation ---- */
  let totalDonations = 0;
  let donationCount = 0;
  let failedCount = 0;
  let donationTrend: number | null = null;
  let recent: {
    name: string;
    date: string;
    amount: string;
    status: string;
  }[] = [];
  let razorpayError = false;
  let captured: RzpPayment[] = [];

  try {
    const payments = await fetchAllPayments();
    captured = payments.filter((p) => p.status === "captured");

    donationCount = captured.length;
    failedCount = payments.filter((p) => p.status === "failed").length;
    totalDonations = Math.round(
      captured.reduce((sum, p) => sum + p.amount, 0) / 100
    );

    // Recent activity — latest 6 payments (any status)
    recent = [...payments]
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, 6)
      .map((p) => {
        const donor =
          p.email && p.email.includes("@")
            ? p.email.split("@")[0]
            : p.contact || "Anonymous";
        return {
          name: `${p.description || "Donation"} — ${donor}`,
          date: new Date(p.created_at * 1000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          amount: `₹${(p.amount / 100).toLocaleString("en-IN")}`,
          status:
            p.status === "captured"
              ? "Received"
              : p.status === "failed"
              ? "Failed"
              : p.status.charAt(0).toUpperCase() + p.status.slice(1),
        };
      });
  } catch (e) {
    console.error("❌ Dashboard Razorpay error:", e);
    razorpayError = true;
  }

  /* ---- 6-month chart window ----
     Default to the trailing 6 months ending this month. But if that window has
     no captured donations while older ones exist, anchor the window to the most
     recent donation so the chart shows real history instead of looking empty. */
  let anchor = monthStart(now);
  if (captured.length > 0) {
    const latest = captured.reduce((m, p) => Math.max(m, p.created_at), 0);
    const latestMonth = monthStart(new Date(latest * 1000));
    const monthsAgo =
      (now.getFullYear() - latestMonth.getFullYear()) * 12 +
      (now.getMonth() - latestMonth.getMonth());
    if (monthsAgo > 5) anchor = latestMonth;
  }

  const buckets = Array.from({ length: 6 }, (_, idx) => {
    const i = 5 - idx;
    const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      name: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear(),
      value: 0,
    };
  });

  if (!razorpayError) {
    // Monthly totals (₹) within the window
    const bucketByKey = new Map(buckets.map((b) => [b.key, b]));
    for (const p of captured) {
      const d = new Date(p.created_at * 1000);
      const bucket = bucketByKey.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (bucket) bucket.value += p.amount / 100;
    }
    buckets.forEach((b) => (b.value = Math.round(b.value)));

    // Month-over-month trend for the donations card
    const cur = buckets[5].value;
    const prev = buckets[4].value;
    if (prev > 0) donationTrend = Math.round(((cur - prev) / prev) * 100);
    else if (cur > 0) donationTrend = 100;
  }

  const first = buckets[0];
  const last = buckets[5];
  const rangeLabel =
    first.year === last.year
      ? `${first.name} – ${last.name} ${last.year}`
      : `${first.name} ${first.year} – ${last.name} ${last.year}`;

  return NextResponse.json({
    totalDonations,
    donationCount,
    failedCount,
    donationTrend,
    campaigns,
    programs,
    teamMembers,
    users,
    monthly: buckets.map((b) => ({ name: b.name, value: b.value })),
    rangeLabel,
    recent,
    razorpayError,
    mongoError,
  });
}
