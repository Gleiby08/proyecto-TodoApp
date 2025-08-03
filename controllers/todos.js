const todosRouter = require("express").Router();
const User = require("../models/user");
const Todo = require("../models/todo");

todosRouter.get('/', async (request, response, next) => {
    try {
        const user = request.user;
        const todos = await Todo.find({ user: user.id });
        return response.status(200).json(todos);
    } catch (error) {
        next(error);
    }
});

todosRouter.post('/', async (request, response, next) => {
    try {
        const user = request.user;
        const { text } = request.body;
        const newTodo = new Todo({
            text,
            checked: false,
            user: user._id
        });
        const savedTodo = await newTodo.save();
        user.todos = user.todos.concat(savedTodo._id);
        await user.save();
        return response.status(201).json(savedTodo);
    } catch (error) {
        next(error);
    }
});

todosRouter.delete('/:id', async (request, response, next) => {
    try {
        const user = request.user;
        const todoIdToDelete = request.params.id;
        await Todo.findByIdAndDelete(todoIdToDelete);
        user.todos = user.todos.filter(todoId => todoId.toString() !== todoIdToDelete);
        await user.save();
        return response.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

todosRouter.patch('/:id', async (request, response, next) => {
    try {
        const user = request.user;
        const { checked } = request.body;
        await Todo.findByIdAndUpdate(request.params.id, { checked });
        return response.sendStatus(200);
    } catch (error) {
        next(error);
    }
});

module.exports= todosRouter;