import { NextFunction, Request, Response } from 'express';
import { globalErrorHanlder } from '../middlewares/globalErrorHandler';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import userModel from './userModel';
import { sign } from 'jsonwebtoken';
import { config } from '../config/config';

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

  // hashed password

  const hashedPassword = await bcrypt.hash(password, 10);

  // process / logic

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // token generation (generating jwt tokens)

  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: '7d',
  });

  // response

  res.json({ accessToken: token });
};

export { userRegister };
