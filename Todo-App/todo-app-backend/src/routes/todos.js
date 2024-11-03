const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/lists', todoController.createList);
router.get('/lists', todoController.getLists);
router.put('/lists/:id', todoController.updateList);
router.delete('/lists/:id', todoController.deleteList);

router.post('/lists/:listId/items', todoController.createItem);
router.get('/lists/:listId/items', todoController.getItems);
router.put('/lists/:listId/items/:itemId', todoController.updateItem);
router.delete('/lists/:listId/items/:itemId', todoController.deleteItem);

module.exports = router;