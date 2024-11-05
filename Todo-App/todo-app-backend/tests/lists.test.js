const request = require('supertest');
const app = require('../src/app')
const User = require('../src/models/User');
const List = require('../src/models/List');
const jwt = require('jsonwebtoken');

let authToken;
let testUser;

describe('List Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await List.deleteMany({});

    // Create test user and generate token
    testUser = await User.create({
      username: 'testuser',
      password: 'testpass123'
    });

    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET);
  });

  describe('POST /api/todos/lists', () => {
    it('should create a new list', async () => {
      const response = await request(app)
        .post('/api/todos/lists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test List'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Test List');
      expect(response.body).toHaveProperty('user', testUser._id.toString());
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/todos/lists')
        .send({
          name: 'Test List'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/todos/lists', () => {
    it('should get all lists for user', async () => {
      // Create test lists
      await List.create([
        { name: 'List 1', user: testUser._id },
        { name: 'List 2', user: testUser._id }
      ]);

      const response = await request(app)
        .get('/api/todos/lists')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[1]).toHaveProperty('name');
    });
  });

  describe('PUT /api/todos/lists/:id', () => {
    it('should update list name', async () => {
      const list = await List.create({
        name: 'Original Name',
        user: testUser._id
      });

      const response = await request(app)
        .put(`/api/todos/lists/${list._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
    });
  });

  describe('DELETE /api/todos/lists/:id', () => {
    it('should delete list', async () => {
      const list = await List.create({
        name: 'Test List',
        user: testUser._id
      });

      const response = await request(app)
        .delete(`/api/todos/lists/${list._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      
      const deletedList = await List.findById(list._id);
      expect(deletedList).toBeNull();
    });
  });
});