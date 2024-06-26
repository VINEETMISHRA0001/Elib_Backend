import { NextFunction, Request, Response } from 'express';
import { globalErrorHanlder } from '../middlewares/globalErrorHandler';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from './userTypes';
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

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, 'USer Already exists with this email');
      return next(error);
    }

    if (!name || !email || !password) {
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, 'Error While Getting User...'));
  }

  // hashed password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: User;

  try {
    // process / logic

    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // token generation (generating jwt tokens)
  } catch (error) {
    return next(createHttpError(500, 'Error While Creating User..'));
  }

  try {
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: '7d',
    });

    // response
    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, 'error while signing jwt'));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = createHttpError(400, 'All fields are required');

      return next(error);
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return next(createHttpError(404, 'Email not exists'));
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return next(createHttpError(401, 'Email or Password is incorrect'));
    }

    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: '7d',
    });

    // response
    res.status(201).json({ accessToken: token });

    ////////////////////////
  } catch (error) {
    return next(error);
  }
};

export { userRegister, loginUser };
