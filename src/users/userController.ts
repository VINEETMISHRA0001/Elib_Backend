import { NextFunction, Request, Response } from 'express';

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: 'Successfully created a new user' });
};

export { userRegister };
