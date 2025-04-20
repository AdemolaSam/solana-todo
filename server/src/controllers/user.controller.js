const User = require("../models/user.model");
const Todo = require("../models/todo.model");

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("-nonce");
  if (!user) {
    return req.status(404).json({ error: "User not found" });
  }
  return res.status(200).json({ user });
};

exports.updateUser = async (req, res, next) => {
  const { username } = req.body;
  const user = User.findById(req.user._id).select("-nonce");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  user.username = username;
  await user.save();

  return res
    .status(201)
    .json({ message: "Username updated successfully", user: user });
};

exports.getTodo = async (req, res, next) => {
  const todos = await Todo.find({ createdBy: req.user?._id });
  return res.status(200).json({ todos });
};

exports.createTodo = async (req, res, next) => {
  const { ...todo } = req.body;
  const newTodo = await Todo.create(todo);
  return res.status(201).json({
    message: "Todo Added successfully!",
    todo: newTodo,
  });
};
