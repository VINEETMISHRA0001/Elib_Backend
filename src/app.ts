import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import { globalErrorHanlder } from './middlewares/globalErrorHandler';

const app = express();

// Routes

app.get('/', (req, res, next) => {
  res.json({ message: 'Hello From the server' });
});

// global error handler (always put at the end)

app.use(globalErrorHanlder);

export default app;
