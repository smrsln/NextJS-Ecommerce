import type { NextApiRequest, NextApiResponse } from "next";
import UserController from "@/app/controllers/User/UserController";
import DbConnectMiddleware from "@/app/middleware/DbConnectMiddleware";
import { AuthMiddleware } from "@/app/middleware/AuthMiddleware";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await DbConnectMiddleware(
    req,
    res,
    await AuthMiddleware(async (req, res) => {
      const { email, password } = req.body;
      const user = await UserController.createUser(email, password);
      res.status(200).json({ success: true, data: user });
    })
  );
}
