import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { MIN_DONATION, MAX_DONATION, parseDonationAmount } from "../../../lib/donation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // The client sends the donor's chosen amount in rupees. Never trust it —
    // re-validate here, since this is what actually gets charged.
    let rawAmount: unknown;
    try {
      const body = await req.json();
      rawAmount = (body as { amount?: unknown } | null)?.amount;
    } catch {
      rawAmount = undefined;
    }

    const amount = parseDonationAmount(rawAmount);
    if (amount === null) {
      return NextResponse.json(
        {
          error: `Please enter a donation amount between ₹${MIN_DONATION} and ₹${MAX_DONATION.toLocaleString(
            "en-IN"
          )}.`,
        },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `vov_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
