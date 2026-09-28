const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { todoValidator, todoStatusValidator } = require('../validators/todoValidator');

// All todo routes require authentication
router.use(authMiddleware);

router.get('/', todoController.getTodos);
router.get('/progress', todoController.getProgress);
router.get('/:id', todoController.getTodoById);
router.post('/', todoValidator, validate, todoController.createTodo);
router.put('/:id', todoValidator, validate, todoController.updateTodo);
router.patch('/:id/status', todoStatusValidator, validate, todoController.updateStatus);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
