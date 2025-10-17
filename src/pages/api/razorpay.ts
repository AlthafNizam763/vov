import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = req.body;
    const order = { id: "order_123", amount: body.amount || 50000, currency: "INR" };
    return res.status(201).json(order);
  }
  res.setHeader("Allow", ["POST"]);
  return res.status(405).end();
}