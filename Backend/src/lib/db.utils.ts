import mongoose, { type ConnectOptions } from "mongoose";
import logger from "../lib/logger";
import config from "../config/config";

mongoose.set("strictQuery", true);

export const connect = async (): Promise<void> => {
  try {
    let dbURI: string = config.DATABASE_URL.replace(
      "<username>",
      config.DATABASE_USERNAME
    );
    dbURI = dbURI.replace("<password>", config.DATABASE_PASSWORD);

    const DATABASE_OPTIONS: ConnectOptions = {
      dbName: config.DATABASE_NAME,
    };

    await mongoose.connect(dbURI, DATABASE_OPTIONS);
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
  }
};
