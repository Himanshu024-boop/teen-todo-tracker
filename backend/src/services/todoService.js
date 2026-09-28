const todoModel = require('../models/todoModel');

const todoService = {
  async getTodos(userId, filters) {
    return todoModel.find(userId, filters);
  },

  async getTodoById(id, userId) {
    const todo = await todoModel.findById(id, userId);
    if (!todo) {
      const error = new Error('Todo item not found.');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  },

  async createTodo(userId, data) {
    return todoModel.create({
      user_id: userId,
      ...data
    });
  },

  async updateTodo(id, userId, updates) {
    const todo = await todoModel.update(id, userId, updates);
    if (!todo) {
      const error = new Error('Todo item not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return todo;
  },

  async updateStatus(id, userId, status) {
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    return this.updateTodo(id, userId, { status });
  },

  async deleteTodo(id, userId) {
    const deleted = await todoModel.delete(id, userId);
    if (!deleted) {
      const error = new Error('Todo item not found or unauthorized.');
      error.statusCode = 404;
      throw error;
    }
    return { id };
  },

  async getTodayProgress(userId) {
    return todoModel.countToday(userId);
  }
};

module.exports = todoService;
