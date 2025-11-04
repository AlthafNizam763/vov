import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET() {
  try {
    // 🔹 Fetch balance
    const balance = await razorpay.balance.fetch();

    // 🔹 Fetch recent payments
    const payments = await razorpay.payments.all({ count: 100 });

    let totalIncome = 0;
    let totalOutcome = 0;

    payments.items.forEach((p: any) => {
      if (p.status === "captured") totalIncome += p.amount;
      if (p.status === "refunded") totalOutcome += p.amount_refunded;
    });

    return NextResponse.json({
      balance: balance.balance / 100,
      totalIncome: totalIncome / 100,
      totalOutcome: totalOutcome / 100,
    });
  } catch (err: any) {
    console.error("Error fetching Razorpay summary:", err);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
