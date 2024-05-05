import { json } from 'body-parser';
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { verify } from 'jsonwebtoken';
import { config } from '../config/config';

export interface AuthRequest extends Request {
  userId: string;
}

export const authenticatedUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization');

  if (!token) {
    return next(createHttpError(401, 'Authorization Token is Required'));
  }

  const pardsedToken = token.split(' ')[1];

  const decoded = verify(pardsedToken, config.jwtSecret as string);

  const requestObject = req as AuthRequest;

  requestObject.userId = decoded.sub as string;

  next();
};
