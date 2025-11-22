import Joi, { type ValidationResult } from 'joi';
import dotenv from 'dotenv';

interface IEnvVars {
  PORT: string;
  DATABASE_URL: string;
  DATABASE_NAME: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
}

dotenv.config();

// Validation schema for environment variables
const envVarsSchema = Joi.object<IEnvVars>({
  PORT: Joi.string().required().description('Port is required'),
  DATABASE_URL: Joi.string().required().description('DATABASE_URL is required'),
  DATABASE_NAME: Joi.string().required().description('DATABASE_NAME is required'),
  DATABASE_USERNAME: Joi.string().required().description('DATABASE_USERNAME is required'),
  DATABASE_PASSWORD: Joi.string().required().description('DATABASE_PASSWORD is required'),
});

const { error, value }: ValidationResult = envVarsSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
});
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: IEnvVars = value as IEnvVars;

const config: IEnvVars = {
  PORT: envVars.PORT,
  DATABASE_URL: envVars.DATABASE_URL,
  DATABASE_NAME: envVars.DATABASE_NAME,
  DATABASE_USERNAME: envVars.DATABASE_USERNAME,
  DATABASE_PASSWORD: envVars.DATABASE_PASSWORD,
};

export default config;
