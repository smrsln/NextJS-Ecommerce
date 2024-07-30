import type { NextApiRequest, NextApiResponse } from "next";
import UserController from "@/app/controllers/User/UserController";
import DbConnectMiddleware from "@/app/middleware/db-connect-middleware";
import { AuthMiddleware } from "@/app/middleware/auth-middleware";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await DbConnectMiddleware(
    req,
    res,
    await AuthMiddleware(async (req, res) => {
      await UserController.createUser(req, res);
    })
  );
}
