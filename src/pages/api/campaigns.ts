import type { NextApiRequest, NextApiResponse } from "next";

type Campaign = {
  id: number;
  title: string;
  passage: string;
  amount: string;
  detail: string;
  image: string;
};

let campaigns: Campaign[] = [
  {
    id: 1,
    title: "Supporting Children’s Education",
    passage: "Helping kids despite difficult circumstances with education support.",
    amount: "₹5,200 / ₹10,400",
    detail: "Campaign to provide monthly school supplies.",
    image: "",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(campaigns);
  } else if (req.method === "POST") {
    const newCampaign: Campaign = { ...req.body, id: Date.now() };
    campaigns.push(newCampaign);
    res.status(201).json(newCampaign);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    campaigns = campaigns.filter((c) => c.id !== id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}