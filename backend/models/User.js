const mongoose = require("mongoose");
const { readDB, writeDB } = require("../utils/jsonDb");

// Schema definition for Mongoose
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const MongoUser = mongoose.model("User", userSchema);

// Mock User implementation for local JSON fallback
class MockUser {
    constructor(data) {
        this._id = data._id || String(new Date().getTime()) + Math.random().toString(36).substr(2, 5);
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
    }

    async save() {
        const db = readDB();
        const existingIndex = db.users.findIndex(u => u._id === this._id || u.email === this.email);
        const userData = {
            _id: this._id,
            name: this.name,
            email: this.email,
            password: this.password
        };
        if (existingIndex > -1) {
            db.users[existingIndex] = userData;
        } else {
            db.users.push(userData);
        }
        writeDB(db);
        return this;
    }

    static async findOne(query) {
        const db = readDB();
        let found = null;
        if (query.email) {
            found = db.users.find(u => u.email === query.email);
        } else if (query._id) {
            found = db.users.find(u => u._id === query._id);
        }
        return found ? new MockUser(found) : null;
    }
}

// Wrapper to switch between Mongo and local file DB
class UserWrapper {
    constructor(data) {
        if (!global.isMongoConnected) {
            return new MockUser(data);
        }
        return new MongoUser(data);
    }

    static findOne(query) {
        if (!global.isMongoConnected) {
            return MockUser.findOne(query);
        }
        return MongoUser.findOne(query);
    }
}

module.exports = UserWrapper;
