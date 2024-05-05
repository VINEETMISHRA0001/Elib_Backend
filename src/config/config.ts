import { config as conf } from 'dotenv';

conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTON_STRING,
};

export const config = Object.freeze(_config); // prevents overwrite
