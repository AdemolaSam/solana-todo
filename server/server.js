const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const MONGODB_URI = process.env.MONGODB_URI;
const errorHandler = require("./src/middleware/error.middleware");

const app = express();

const connectToDB = () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to Database:::::::::::::::::::"))
    .catch((error) => console.error("Database connection error", error));
};

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use((req, res) => {
  return res
    .status(404)
    .json({ message: "Oops! The requested route does not exist" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(":::::Server listening on port", PORT);
});

process.on("uncaughtException", () => {
  console.log("Uncaught exception just occured");
});
