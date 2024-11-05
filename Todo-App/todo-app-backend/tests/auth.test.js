const request = require('supertest');
const app = require('../src/app')
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

describe('Authentication Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      await User.create({
        username: 'testuser',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'testpass123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', 'testuser');
    });

    it('should fail with invalid password', async () => {
      const hashedPassword = await bcrypt.hash('testpass123', 10);
      await User.create({
        username: 'testuser',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpass'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'testpass123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});