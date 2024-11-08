const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlog,
} = require("../controllers/blogController");
const route = express.Router();
route.post("/blogs", createBlog);
route.get("/blogs", getBlogs);
route.get("/blogs/:blogId", getBlog);
module.exports = route;
