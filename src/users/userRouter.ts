import express from 'express';

import { loginUser, userRegister } from './userController';

const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post('/login', loginUser);

export default userRouter;
