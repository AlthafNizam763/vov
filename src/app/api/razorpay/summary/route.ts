import Razorpay from "razorpay";
import { NextResponse } from "next/server";

type RazorpayBalance = {
  entity: string;
  currency: string;
  balance: number;
};

type RazorpayPayment = {
  id: string;
  amount: number;
  amount_refunded: number;
  status: string;
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function GET() {
  try {
    const balance = (await (razorpay as any).balance.fetch()) as RazorpayBalance;
    const payments = await (razorpay as any).payments.all({ count: 100 });
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
  } catch (err) {
    console.error("Error fetching Razorpay summary:", err);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
