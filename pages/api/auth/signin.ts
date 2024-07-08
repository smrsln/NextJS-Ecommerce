import type { NextApiRequest, NextApiResponse } from "next";
import UserController from "@/app/controllers/User/UserController";
import DbConnectMiddleware from "@/app/middleware/db-connect-middleware";
import { AuthMiddleware } from "@/app/middleware/auth-middleware";

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await DbConnectMiddleware(
    req,
    res,
    await AuthMiddleware(async (req, res) => {
      const { email, password } = req.body;
      const user = await UserController.signIn(email, password);
      res.status(200).json({ success: true, data: user });
    })
  );
}
