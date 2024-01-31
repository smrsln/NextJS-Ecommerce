import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/app/models/User";
import dbConnect from "@/db";

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  await dbConnect();

  try {
    const user = await User.signIn(email, password);
    res.status(200).json({ success: true, data: user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
