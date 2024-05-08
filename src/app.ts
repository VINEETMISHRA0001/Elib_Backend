import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import cors from 'cors';
import { config } from './config/config';
import { globalErrorHanlder } from './middlewares/globalErrorHandler';
import userRouter from './users/userRouter';
import morgan from 'morgan';
import bookRouter from './book/bookRouter';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: config.frontend_url,
  })
);

// Routes

app.use('/api/v1/users', userRouter);
app.use('/api/v1/books', bookRouter);

// global error handler (always put at the end)

app.use(globalErrorHanlder);

export default app;
