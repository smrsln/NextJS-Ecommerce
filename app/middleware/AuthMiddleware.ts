import { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";
import { logger } from "@/lib/logger";

export const AuthMiddleware =
  (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const serviceName = "Auth";
    try {
      await handler(req, res);
      logger.info(`Successful authentication for user: ${req.body.email}`, {
        service: serviceName,
        method: req.method,
        path: req.url,
      });
    } catch (err) {
      const error = err as Error; // Type assertion
      logger.error(`Failed authentication for user: ${req.body.email}`, {
        service: serviceName,
        method: req.method,
        path: req.url,
        error: error.message,
        statusCode:
          err instanceof createHttpError.HttpError ? err.statusCode : undefined,
      });
      if (err instanceof createHttpError.HttpError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        logger.error(error.message);
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  };
