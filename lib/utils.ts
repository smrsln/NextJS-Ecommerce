import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextApiResponse } from "next";
import createHttpError from "http-errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleError(res: NextApiResponse, error: any) {
  if (createHttpError.isHttpError(error)) {
    res.status(error.status).json({ success: false, message: error.message });
  } else {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
