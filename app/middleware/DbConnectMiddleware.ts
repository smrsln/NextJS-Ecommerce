import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import dbCheck from "@/db";

export default async function dbConnectMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) {
  try {
    await dbCheck();
    await next(req, res);
  } catch (error) {
    console.error("DB connection error:", error);
  }
}
