import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import { globalErrorHanlder } from './middlewares/globalErrorHandler';
import userRouter from './users/userRouter';
import morgan from 'morgan';

const app = express();
app.use(express.json());

app.use(morgan('dev'));

// Routes

app.use('/api/v1/users', userRouter);

// global error handler (always put at the end)

app.use(globalErrorHanlder);

export default app;
