const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const List = require('../src/models/List');
const Item = require('../src/models/Item');
const jwt = require('jsonwebtoken');

let authToken;
let testUser;
let testList;

describe('Item Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await List.deleteMany({});
    await Item.deleteMany({});

    // Create test user and generate token
    testUser = await User.create({
      username: 'testuser',
      password: 'testpass123'
    });

    authToken = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET);

    // Create test list
    testList = await List.create({
      name: 'Test List',
      user: testUser._id
    });
  });

  describe('POST /api/todos/lists/:listId/items', () => {
    it('should create a new item', async () => {
      const response = await request(app)
        .post(`/api/todos/lists/${testList._id}/items`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Item',
          detail: 'Test Detail'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Test Item');
      expect(response.body).toHaveProperty('detail', 'Test Detail');
      expect(response.body).toHaveProperty('list', testList._id.toString());
    });
  });

  describe('GET /api/todos/lists/:listId/items', () => {
    it('should get all items in a list', async () => {
      // Create test items
      await Item.create([
        { title: 'Item 1', detail: 'Detail 1', list: testList._id },
        { title: 'Item 2', detail: 'Detail 2', list: testList._id }
      ]);

      const response = await request(app)
        .get(`/api/todos/lists/${testList._id}/items`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[1]).toHaveProperty('title');
    });
  });

  describe('PUT /api/todos/lists/:listId/items/:itemId', () => {
    it('should update item', async () => {
      const item = await Item.create({
        title: 'Original Title',
        detail: 'Original Detail',
        list: testList._id
      });

      const response = await request(app)
        .put(`/api/todos/lists/${testList._id}/items/${item._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          detail: 'Updated Detail'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Updated Title');
      expect(response.body).toHaveProperty('detail', 'Updated Detail');
    });
  });

  describe('DELETE /api/todos/lists/:listId/items/:itemId', () => {
    it('should delete item', async () => {
      const item = await Item.create({
        title: 'Test Item',
        detail: 'Test Detail',
        list: testList._id
      });

      const response = await request(app)
        .delete(`/api/todos/lists/${testList._id}/items/${item._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      
      const deletedItem = await Item.findById(item._id);
      expect(deletedItem).toBeNull();
    });
  });
});