import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Console log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: "debug", // show all logs in dev
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // print stack traces
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;
