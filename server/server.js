import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import messageRoutes from './routes/messageRoutes.js';

dotenv.config();
const app = express();

// 🚫 Rate limiter to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds
  max: 5,
  message: 'Too many requests. Please slow down.',
});

app.use(cors());
app.use(limiter);
app.use(express.json());

app.use('/api/messages', messageRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎬 Server running on port ${PORT}`);
});
