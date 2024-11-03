// init-mongo.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create collections
    await mongoose.connection.createCollection('users');
    await mongoose.connection.createCollection('lists');
    await mongoose.connection.createCollection('items');

    // Create test user with explicit salt rounds
    const SALT_ROUNDS = 10;
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    // First delete existing test user to ensure clean state
    await User.deleteOne({ username: 'testuser' });

    // Create new test user
    const newUser = await User.create({
      username: 'testuser',
      password: hashedPassword
    });

    console.log('Test user created successfully');
    console.log('Test password hash:', hashedPassword);

    // Verify the password works immediately after creation
    const verificationTest = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password verification test:', verificationTest);

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();