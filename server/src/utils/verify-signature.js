const bs58 = require("bs58");
const { PublicKey } = require("@solana/web3.js");
const nacl = require("tweetnacl");

const verifySignature = (walletAddress, message, signature) => {
  const publicKey = new PublicKey(walletAddress);

  // convert signature and mesage to bytes
  const messageInBytes = Buffer.from(message);
  const signatureInBytes = bs58.default.decode(signature);

  // verufy
  return nacl.sign.detached.verify(
    messageInBytes,
    signatureInBytes,
    publicKey.toBytes()
  );
};

module.exports = verifySignature;
