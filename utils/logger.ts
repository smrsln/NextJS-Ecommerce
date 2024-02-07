// utils/logger.ts
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
// import * as Sentry from "@sentry/nextjs";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "auth-service" },
  transports: [
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "error",
    }),
    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// logger.add(
//   new winston.transports.Console({
//     format: winston.format.printf((info) => {
//       Sentry.captureException(new Error(info.message));
//       return `${info.level}: ${info.message}`;
//     }),
//   })
// );
