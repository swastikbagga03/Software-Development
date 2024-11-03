const request = require('supertest');
const app = require('../src/app');
const User = require('../models/User');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication Tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('Should login existing user', async () => {
    const user = new User({
      username: 'testuser',
      password: 'password123'
    });
    await user.save();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('username', 'testuser');
  });
});