const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const { PublicKey } = require("@solana/web3.js");
const verifySignature = require("../utils/verify-signature");

exports.getChallenge = async (req, res, next) => {
  const { walletAddress } = req.query;

  if (!walletAddress || !PublicKey.isOnCurve(walletAddress)) {
    console.log("No wallet or invalid wallet");
    return res
      .status(400)
      .json({ message: "Please provide a valid Solana wallet address" });
  }

  try {
    let user = await User.findOne({ walletAddress });

    const nonce = crypto.randomBytes(64).toString("hex");
    if (!user) {
      user = await User.create({ walletAddress, nonce });
    } else {
      user.nonce = nonce;
      await user.save();
    }

    const message = `Sign this message to verify ownership of your wallet\n ${
      user.nonce
    }. TimeStamp: ${new Date().getTime()}`;

    return res.status(201).json({ message });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ error: "Something went wrong. Please try again" });
  }
};

exports.verify = async (req, res, next) => {
  const { walletAddress, message, signature } = req.body;

  if (!walletAddress || !message || !signature) {
    return res
      .status(400)
      .json({ error: "Please porvide walletAddress, message, and signature" });
  }

  const isValidSignature = verifySignature(walletAddress, message, signature);

  if (!isValidSignature) {
    return res.status(400).json({ error: "Invalid Signature" });
  }

  const user = await User.findOne({ walletAddress }).select("-nonce");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  return res.status(200).json({
    token,
    user,
  });
};
