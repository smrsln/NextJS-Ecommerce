import type { NextApiRequest, NextApiResponse } from "next";
import { logger } from "@/utils/logger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { error, errorInfo } = req.body;
  logger.error(error, errorInfo);
  res.status(200).json({ status: "Error logged" });
}
