const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");

async function createBlog(req, res) {
  try {
    const { title, description, draft, creator } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Please fill title field",
      });
    }

    if (!description) {
      return res.status(400).json({
        message: "Please fill description field",
      });
    }

    const findUser = await User.findById(creator);

    if (!findUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const blog = await Blog.create({
      title,
      description,
      draft,
      creator,
    });

    return res.status(200).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBlogs(req, res) {
  try {
    // const blogs = await Blog.find({ draft: false }).populate("creator");
    const blogs = await Blog.find({ draft: false }).populate({
      path: "creator",
      select: "-password",
    });

    return res.status(200).json({
      message: "Blogs fetched Successfully",
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBlog(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findOne({ id });

    if (!blog) {
      return res.status(404).json({
        message: "Blog Not found",
      });
    }
    return res.status(200).json({
      message: "Blog fetched Successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

// async function updateBlog(req, res) {
//     try {
//             const creator = req.user;
//             // console.log(creator);
//             const { id } = req.params;

//             const { title, description, draft , blogId} = req.body;

// const blog = await Blog.findOne({ blogId: id });

// if (!blog) {
//   return res.status(500).json({
//     message: "Blog is not found",
//   });
// }

// if (!(creator == blog.creator)) {
//   return res.status(500).json({
//     message: "You are not authorized for this action",
//   });
// }

//     } catch (error) {
//          return res.status(500).json({
//            message: error.message,
//          });
//     }
// }
module.exports = {
  createBlog,
  //   deleteBlog,
  getBlog,
  getBlogs,
  //   updateBlog,
  //   likeBlog,
};
