import type { NextApiRequest, NextApiResponse } from "next";

type Program = {
  id: number;
  passage: string;
  date: string;
  image: string;
};

let programs: Program[] = [
  {
    id: 1,
    passage: "Spreading Awareness, Saving Lives",
    date: "15 Feb, 2023",
    image: "",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(programs);
  } else if (req.method === "POST") {
    const newProgram: Program = { ...req.body, id: Date.now() };
    programs.push(newProgram);
    res.status(201).json(newProgram);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    programs = programs.filter((p) => p.id !== id);
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}