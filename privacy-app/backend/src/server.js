import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authRouter from '../routes/auth.route.js';
import dataRouter from '../routes/dataClassification.route.js';
import dsarRouter from '../routes/dsar.route.js';

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/data", dataRouter);
app.use("/dsar", dsarRouter);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


  app.get('/', (req, res) => {
    res.send('Hello, World!');
  })


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));