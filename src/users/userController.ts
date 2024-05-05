import { NextFunction, Request, Response } from 'express';
import { globalErrorHanlder } from '../middlewares/globalErrorHandler';
import createHttpError from 'http-errors';

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // validation

  const { name, email, password } = req.body;
  const error = createHttpError(400, 'All fields are required');
  console.log(req.body);

  if (!name || !email || !password) {
    return next(error);
  }
  // process / logic

  // response

  res.json({ message: 'Successfully created a new user' });
};

export { userRegister };
