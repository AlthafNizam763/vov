// ./src/pages/api/razorpay/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

/**
 * Creates a Razorpay order
 */
export async function POST(request: Request) {
  const { amount }: { amount: number } = await request.json();

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const options = {
    amount: amount * 100, // Convert to paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Razorpay error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    console.error("Unknown error while creating Razorpay order:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating the order." },
      { status: 500 }
    );
  }
}
