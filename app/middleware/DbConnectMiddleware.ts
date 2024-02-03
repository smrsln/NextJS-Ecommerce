import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import dbConnect from "@/db";

export default async function dbConnectMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) {
  try {
    await dbConnect();
    await next(req, res);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    res.status(500).json({ error: "Database connection error" });
  }
}
