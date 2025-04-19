const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxLength: [20, "Task name must not exceed 20 characters"],
  },

  description: {
    type: String,
  },

  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

  dueDate: {
    type: Date,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
