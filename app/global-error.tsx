"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

interface CustomError extends Error {
  statusCode?: number;
  message?: string;
}

export default function GlobalError({ error }: { error: CustomError }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <Error statusCode={error?.statusCode || 500}>
      {error?.message || "An error occurred"}
    </Error>
  );
}
