import { config as conf } from 'dotenv';

conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTON_STRING,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  cloudName: process.env.CLOUDINARY_CLOUD,
  cloudSecret: process.env.CLOUDINARY_SECRET,
  cloudKey: process.env.CLOUDINARY_API_KEY,
  frontend_url: process.env.FRONTEND_URL,
};

export const config = Object.freeze(_config); // prevents overwrite
