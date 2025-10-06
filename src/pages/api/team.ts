import type { NextApiRequest, NextApiResponse } from "next";

let team: any[] = [
  {
    id: 1,
    name: "Shameera Begum",
    Description: "A charity member is someone who actively supports the mission of a charitable organization through time, effort, or financial contributions.",
    image: "",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(team);
  } else if (req.method === "POST") {
    const newMember = { ...req.body, id: Date.now() };
    team.push(newMember);
    res.status(201).json(newMember);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    team = team.filter((t) => t.id !== id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}