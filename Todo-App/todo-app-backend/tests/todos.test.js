const request = require('supertest');
const app = require('../src/app');
const User = require('../models/User');
const List = require('../models/List');
const Item = require('../models/Item');
const jwt = require('jsonwebtoken');

let token;
let userId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const user = new User({
    username: 'testuser',
    password: 'password123'
  });
  await user.save();
  userId = user._id;
  
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Todo List Tests', () => {
  beforeEach(async () => {
    await List.deleteMany({});
    await Item.deleteMany({});
  });

  test('Should create new list', async () => {
    const response = await request(app)
      .post('/api/todos/lists')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test List'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'Test List');
  });

  test('Should create new item in list', async () => {
    const list = new List({
      name: 'Test List',
      user: userId
    });
    await list.save();

    const response = await request(app)
      .post(`/api/todos/lists/${list._id}/items`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Item',
        detail: 'Test Detail'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', 'Test Item');
    expect(response.body).toHaveProperty('detail', 'Test Detail');
  });
});