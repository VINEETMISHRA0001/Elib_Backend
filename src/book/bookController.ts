import { NextFunction, Request, Response } from 'express';
import { globalErrorHanlder } from '../middlewares/globalErrorHandler';
import createHttpError from 'http-errors';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Okkkk created' });
};

export { createBook };
