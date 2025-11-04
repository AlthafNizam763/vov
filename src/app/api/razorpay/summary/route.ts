import Razorpay from "razorpay";
import { NextResponse } from "next/server";

// 🔹 Extend the Razorpay class type safely
interface RazorpayWithBalance extends Razorpay {
  balance: {
    fetch: () => Promise<{ entity: string; currency: string; balance: number }>;
  };
}

// Define Razorpay types
type RazorpayPayment = {
  id: string;
  amount: number;
  amount_refunded: number;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
}) as RazorpayWithBalance;

export async function GET() {
  try {
    // 🔹 Fetch account balance
    const balance = await razorpay.balance.fetch();

    // 🔹 Fetch recent payments
    const payments = await razorpay.payments.all({ count: 100 });
    const items = payments.items as RazorpayPayment[];

    let totalIncome = 0;
    let totalOutcome = 0;

    items.forEach((p) => {
      if (p.status === "captured") totalIncome += p.amount;
      if (p.status === "refunded") totalOutcome += p.amount_refunded;
    });

    return NextResponse.json({
      balance: balance.balance / 100,
      totalIncome: totalIncome / 100,
      totalOutcome: totalOutcome / 100,
    });
  } catch (err: unknown) {
    console.error("Error fetching Razorpay summary:", err);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
