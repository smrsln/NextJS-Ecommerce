import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import * as Sentry from "@sentry/nextjs";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),

  transports: [
    new DailyRotateFile({
      filename: "/tmp/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),
    new DailyRotateFile({
      filename: "/tmp/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.printf((info) => {
      if (info.level === "error") {
        if (typeof info.message === "object") {
          Sentry.captureException(info.message);
        } else {
          Sentry.captureException(new Error(info.message));
        }
      }
      return `${info.level}: ${info.message} - {service: "${info.service}"}`;
    }),
  })
);

// Add error handling
logger.on("error", (error) => {
  console.error("Error occurred during logging:", error);
});
