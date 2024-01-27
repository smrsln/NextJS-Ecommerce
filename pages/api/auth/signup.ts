import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/app/models/User";
import type { IUserCreate } from "@/app/types/User";
import dbConnect from "@/db";

const UserModel = User as IUserCreate;

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  await dbConnect();

  try {
    const user = await UserModel.createUser(email, password);
    res.status(200).json({ success: true, data: user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false });
    }
  }
}
