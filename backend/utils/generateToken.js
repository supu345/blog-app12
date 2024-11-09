const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateJWT(payload) {
  // Return the generated token synchronously
  return jwt.sign(payload, process.env.JWT_SECRET);
}

function verifyJWT(token) {
  try {
    // Verify the token synchronously
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    // Return an error or handle it accordingly
    return { success: false, message: "Invalid or expired token" };
  }
}

function decodeJWT(token) {
  // Decode the token without verification (doesn't check the signature)
  return jwt.decode(token);
}

module.exports = { generateJWT, verifyJWT, decodeJWT };
