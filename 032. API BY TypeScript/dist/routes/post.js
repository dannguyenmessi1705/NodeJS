"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
let todoList = [];
router.get("/", (req, res, next) => {
    res.status(200).json({
        todoList,
    });
});
router.post("/post", (req, res, next) => {
    const body = req.body;
    const newTodo = {
        name: body.name,
        ID: Math.random().toString()
    };
    todoList.push(newTodo);
    res.status(201).json({
        message: "Added Todo",
        todoList: newTodo
    });
});
router.put("/update/:todoID", (req, res, next) => {
    const params = req.params;
    const body = req.body;
    const todoID = params.todoID;
    const todoIndex = todoList.findIndex(todo => todo.ID === todoID);
    if (todoIndex >= 0) {
        todoList[todoIndex] = { name: body.name, ID: todoID };
        return res.status(200).json({
            message: "Updated Todo",
            todoList
        });
    }
});
router.delete("/delete/:todoID", (req, res, next) => {
    const params = req.params;
    const todoID = params.todoID;
    todoList = todoList.filter(t => t.ID !== todoID);
    res.status(200).json({
        message: "Deleted Todo",
        todoList
    });
});
exports.default = router;
