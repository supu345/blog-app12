const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  try {
    // Check if the DB_URL is provided
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is not defined in .env file");
    }

    // Connect to MongoDB with connection options
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000, // Connection timeout (in ms)
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
    });
    console.log("Db Connected successfully");
  } catch (error) {
    console.log("Error occurred while connecting to DB");
    console.error(error.message || error); // Log the error message
    process.exit(1); // Exit process with failure
  }
}

// Reconnect if the connection is lost
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection lost. Attempting to reconnect...");
  dbConnect();
});

// Reconnect on error (if there's a network failure, for example)
mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
  dbConnect();
});

module.exports = dbConnect;
