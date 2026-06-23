const mongoose = require("mongoose");
const { readDB, writeDB } = require("../utils/jsonDb");

// Schema definition for Mongoose
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    dueDate: {
        type: Date
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const MongoTask = mongoose.model("Task", taskSchema);

// Mock Task implementation for local JSON fallback
class MockTask {
    constructor(data) {
        this._id = data._id || String(new Date().getTime()) + Math.random().toString(36).substr(2, 5);
        this.title = data.title;
        this.description = data.description || "";
        this.completed = data.completed ?? false;
        this.priority = data.priority || "medium";
        this.dueDate = data.dueDate || null;
        this.user = data.user;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    async save() {
        const db = readDB();
        const existingIndex = db.tasks.findIndex(t => t._id === this._id);
        this.updatedAt = new Date().toISOString();
        const taskData = {
            _id: this._id,
            title: this.title,
            description: this.description,
            completed: this.completed,
            priority: this.priority,
            dueDate: this.dueDate,
            user: this.user,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
        if (existingIndex > -1) {
            db.tasks[existingIndex] = taskData;
        } else {
            db.tasks.push(taskData);
        }
        writeDB(db);
        return this;
    }

    async deleteOne() {
        const db = readDB();
        db.tasks = db.tasks.filter(t => t._id !== this._id);
        writeDB(db);
        return { deletedCount: 1 };
    }

    static async find(query) {
        const db = readDB();
        let list = db.tasks;
        if (query.user) {
            list = list.filter(t => String(t.user) === String(query.user));
        }
        return list.map(t => new MockTask(t));
    }

    static async findById(id) {
        const db = readDB();
        const found = db.tasks.find(t => String(t._id) === String(id));
        return found ? new MockTask(found) : null;
    }
}

// Wrapper class
class TaskWrapper {
    constructor(data) {
        if (!global.isMongoConnected) {
            return new MockTask(data);
        }
        return new MongoTask(data);
    }

    static find(query) {
        if (!global.isMongoConnected) {
            return MockTask.find(query);
        }
        return MongoTask.find(query);
    }

    static findById(id) {
        if (!global.isMongoConnected) {
            return MockTask.findById(id);
        }
        return MongoTask.findById(id);
    }
}

module.exports = TaskWrapper;
