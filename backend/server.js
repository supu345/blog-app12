const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const userRoute = require("./routes/userRoutes");
const blogRoute = require("./routes/blogRoutes");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();

// app.listen(PORT, function (err) {
//   if (err) console.log("Error in server setup");
//   console.log("Server listening on Port", PORT);
// });
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);

app.listen(PORT, () => {
  console.log("Server Started");
  dbConnect();
});
