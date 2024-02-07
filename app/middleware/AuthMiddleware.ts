import { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";
import { logger } from "@/utils/logger";

export const AuthMiddleware =
  (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
      logger.info(`Successful authentication for user: ${req.body.email}`);
    } catch (err) {
      logger.error(`Failed authentication for user: ${req.body.email}`);
      if (err instanceof createHttpError.HttpError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        const error = err as Error; // Type assertion
        logger.error(error.message);
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  };
