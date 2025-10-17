import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // create order, etc.
    const order = { id: "order_123", amount: 50000, currency: "INR" };
    return res.status(201).json(order);
  }
  return res.status(405).end();
}