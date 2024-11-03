const List = require('../models/List');
const Item = require('../models/Item');

exports.createList = async (req, res) => {
  try {
    const list = new List({
      name: req.body.name,
      user: req.user.id
    });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLists = async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.id });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateList = async (req, res) => {
  try {
    const list = await List.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name: req.body.name },
      { new: true }
    );
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const list = await List.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }
    await Item.deleteMany({ list: req.params.id });
    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const list = await List.findOne({
      _id: req.params.listId,
      user: req.user.id
    });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const item = new Item({
      title: req.body.title,
      detail: req.body.detail,
      list: req.params.listId
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const list = await List.findOne({
      _id: req.params.listId,
      user: req.user.id
    });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const items = await Item.find({ list: req.params.listId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const list = await List.findOne({
      _id: req.params.listId,
      user: req.user.id
    });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const item = await Item.findOneAndUpdate(
      { _id: req.params.itemId, list: req.params.listId },
      { title: req.body.title, detail: req.body.detail },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const list = await List.findOne({
      _id: req.params.listId,
      user: req.user.id
    });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const item = await Item.findOneAndDelete({
      _id: req.params.itemId,
      list: req.params.listId
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};