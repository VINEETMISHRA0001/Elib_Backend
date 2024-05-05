import express from 'express';

import { userRegister } from './userController';

const userRouter = express.Router();

userRouter.post('/register', userRegister);

export default userRouter;
