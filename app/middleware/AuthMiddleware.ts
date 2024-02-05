import { NextApiRequest, NextApiResponse } from "next";
import createHttpError from "http-errors";

export const AuthMiddleware =
  (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (err) {
      if (err instanceof createHttpError.HttpError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
      }
    }
  };
