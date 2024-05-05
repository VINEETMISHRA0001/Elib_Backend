import { NextFunction, Request, Response } from 'express';
import { globalErrorHanlder } from '../middlewares/globalErrorHandler';
import createHttpError from 'http-errors';
import userModel from './userModel';

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validation

  const { name, email, password } = req.body;

  const error = createHttpError(400, 'All fields are required');

  const user = await userModel.findOne({ email });

  if (user) {
    const error = createHttpError(400, 'USer Already exists with this email');
    return next(error);
  }

  if (!name || !email || !password) {
    return next(error);
  }
  // process / logic

  // response

  res.json({ message: 'Successfully created a new user' });
};

export { userRegister };
