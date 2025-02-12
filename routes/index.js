import express from 'express';
const Router = express.Router();

import authRouter from './authRoles.js';
import userRouter from './user.js';

Router.use('/auth',authRouter);
Router.use('/user',userRouter);



export default Router;
