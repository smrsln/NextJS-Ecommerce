import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/app/models/User";
import dbConnectMiddleware from "@/app/middleware/DbConnectMiddleware";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnectMiddleware(req, res, async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.createUser(email, password);
      res.status(200).json({ success: true, data: user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false });
      }
    }
  });
}
