import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Router from './routes/index.js';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use('/api',Router);


