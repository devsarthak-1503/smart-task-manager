const express = require("express");

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/tasks", authMiddleware, async (req, res) => {

    try {

        const { title, description, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const task = new Task({
            title,
            description,
            priority: priority || "medium",
            dueDate: dueDate || null,
            user: req.user.id
        });

        await task.save();

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get("/tasks", authMiddleware, async (req, res) => {

    try {

        const tasks = await Task.find({
            user: req.user.id
        });

        res.status(200).json(tasks);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.put("/tasks/:id", authMiddleware, async (req, res) => {

    try {

        const { title, description, completed, priority, dueDate } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        task.title = title !== undefined ? title : task.title;
        task.description = description !== undefined ? description : task.description;
        task.completed = completed !== undefined ? completed : task.completed;
        task.priority = priority !== undefined ? priority : task.priority;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.delete("/tasks/:id", authMiddleware, async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        await task.deleteOne();

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;