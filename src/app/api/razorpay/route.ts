// ./src/api/razorpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

/**
 * Creates a Razorpay order
 */
export async function POST(request: NextRequest) {
  const { amount }: { amount: number } = await request.json();

  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
 
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
 
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("Razorpay error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
