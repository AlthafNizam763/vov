import type { NextApiRequest, NextApiResponse } from "next";

let hero = {
  heading: "Support Our Mission",
  headline: "Together, let’s spread happiness from the heart",
  passage: "No matter how small the donation, your gift means a lot. Together, let’s spread happiness and help fellow humans in need.",
  amount: "₹120,000 Raised of ₹600,000 Goal",
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(hero);
  } else if (req.method === "PUT") {
    hero = { ...hero, ...req.body };
    res.status(200).json(hero);
  } else {
    res.status(405).end();
  }
}