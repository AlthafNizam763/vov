import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const order = { id: "order_123", amount: body.amount ?? 50000, currency: "INR" };
  return NextResponse.json(order, { status: 201 });
}