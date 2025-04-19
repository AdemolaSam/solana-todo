const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },

  walletAddress: { type: String, required: true },

  nonce: {
    type: String,
    default: () => crypto.randomBytes(64).toString("hex"),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
