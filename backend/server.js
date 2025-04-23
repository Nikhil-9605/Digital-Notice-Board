require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const noticeRoutes = require('./routes/notices');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);

// Create default admin and user accounts
const createDefaultAccounts = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Default admin account created');
    }

    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      await User.create({
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
      });
      console.log('Default user account created');
    }
  } catch (error) {
    console.error('Error creating default accounts:', error);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createDefaultAccounts();
  })
  .catch((error) => console.error('MongoDB connection error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
