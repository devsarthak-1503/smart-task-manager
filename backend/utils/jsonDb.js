const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../db_fallback.json");

// Helper to read database
const readDB = () => {
    try {
        if (!fs.existsSync(DB_PATH)) {
            fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], tasks: [] }, null, 2));
        }
        const data = fs.readFileSync(DB_PATH, "utf8");
        return JSON.parse(data || '{"users":[],"tasks":[]}');
    } catch (error) {
        console.error("Error reading JSON fallback DB:", error);
        return { users: [], tasks: [] };
    }
};

// Helper to write database
const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
        console.error("Error writing JSON fallback DB:", error);
    }
};

module.exports = { readDB, writeDB };
