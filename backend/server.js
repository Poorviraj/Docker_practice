const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connection
mongoose
    .connect("mongodb://mongo:27017/todoapp")
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// 🧩 Todo schema
const todoSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
    },
    { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

// GET todos
app.get("/todos", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch todos" });
    }
});

// ADD todo
app.post("/todos", async (req, res) => {
    try {
        const todo = await Todo.create({ text: req.body.text });
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create todo" });
    }
});

// ✅ Bind for Docker
app.listen(5000, "0.0.0.0", () => {
    console.log("Server running on 5000");
});
