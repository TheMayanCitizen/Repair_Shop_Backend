import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  DB_HOST: get("DB_ENV_HOST").required().asString(),
  DB_USERNAME: get("DB_ENV_USERNAME").required().asString(),
  DB_PASSWORD: get("DB_ENV_PASSWORD").required().asString(),
  DB_DATABASE: get("DB_ENV_DATABASE").required().asString(),
  DB_PORT: get("DB_ENV_PORT").required().asPortNumber(),
  JWT_SEED: get("JWT_SEED").required().asString(),
  WEBSERVICE_URL: get("WEBSERVICE_URL").required().asString(),

  //NodeMailer envs
  SEND_EMAIL: get("SEND_EMAIL").required().asBool(),
  MAILER_SERVICE: get("MAILER_SERVICE").required().asString(),
  MAILER_EMAIL: get("MAILER_EMAIL").required().asString(),
  MAILER_SECRET_KEY: get("MAILER_SECRET_KEY").required().asString(),
};
