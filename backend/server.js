const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes");
//const cloudinaryConfig = require("./config/cloudinaryConfig"); // Ensure the correct import

const cloudinary = require("cloudinary");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

app.listen(PORT, () => {
  console.log("Server Started");
  dbConnect();
  //  cloudinaryConfig();
});
