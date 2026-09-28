const todoService = require('../services/todoService');

const todoController = {
  async getTodos(req, res, next) {
    try {
      const todos = await todoService.getTodos(req.user.id, req.query);
      res.status(200).json({
        success: true,
        data: todos
      });
    } catch (err) {
      next(err);
    }
  },

  async getTodoById(req, res, next) {
    try {
      const todo = await todoService.getTodoById(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: todo
      });
    } catch (err) {
      next(err);
    }
  },

  async createTodo(req, res, next) {
    try {
      const newTodo = await todoService.createTodo(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: newTodo
      });
    } catch (err) {
      next(err);
    }
  },

  async updateTodo(req, res, next) {
    try {
      const updated = await todoService.updateTodo(req.params.id, req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const updated = await todoService.updateStatus(req.params.id, req.user.id, status);
      res.status(200).json({
        success: true,
        message: 'Todo status updated',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteTodo(req, res, next) {
    try {
      const result = await todoService.deleteTodo(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Todo deleted successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  async getProgress(req, res, next) {
    try {
      const progress = await todoService.getTodayProgress(req.user.id);
      res.status(200).json({
        success: true,
        data: progress
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = todoController;
