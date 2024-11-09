const { verifyJWT } = require("../utils/generateToken");

const verifyUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Please sign in",
      });
    }

    // Verify the token
    const user = verifyJWT(token);

    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please sign in again.",
      });
    }

    req.user = user.id; // Attach user ID to the request object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    // Token format error
    return res.status(400).json({
      success: false,
      message: "Invalid token format. Please sign in again.",
    });
  }
};

module.exports = verifyUser;
