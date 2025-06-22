import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/mongodb.config.js';
connectDB();

import leadsRouter from './routes/lead.route.js';

import cors from 'cors';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/leads', leadsRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})