import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  DB_HOST: get("DB_ENV_HOST").required().asString(),
  DB_USERNAME: get("DB_ENV_USERNAME").required().asString(),
  DB_PASSWORD: get("DB_ENV_PASSWORD").required().asString(),
  DB_DATABASE: get("DB_ENV_DATABASE").required().asString(),
  DB_PORT: get("DB_ENV_PORT").required().asPortNumber(),
};
