const Blog = require("../models/blogSchema");
const User = require("../models/userSchema");
const fs = require("fs");
const uniqid = require("uniqid");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 10 });
const {
  uploadImage,
  deleteImagefromCloudinary,
} = require("../utils/uploadImage");

async function createBlog(req, res) {
  try {
    const creator = req.user;
    const { title, description, draft } = req.body;
    const image = req.file;

    // Check if the file is received
    if (!image) {
      return res.status(400).json({ message: "Image file is required" });
    }

    console.log("Received file:", image);
    console.log({ title, description });

    if (!title) {
      return res.status(400).json({ message: "Please fill title field" });
    }

    if (!description) {
      return res.status(400).json({ message: "Please fill description field" });
    }

    console.log("Creator:", creator);

    const findUser = await User.findById(creator);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Try uploading the image to Cloudinary
    let secure_url, public_id;
    try {
      const uploadResponse = await uploadImage(image.path); // Ensure uploadImage() uses the correct signature generation
      console.log("Upload response:", uploadResponse);
      if (uploadResponse) {
        ({ secure_url, public_id } = uploadResponse);
      } else {
        return res.status(500).json({ message: "Image upload failed" });
      }
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      return res.status(500).json({ message: "Image upload error" });
    }

    // Delete the local file after upload
    fs.unlinkSync(image.path);

    const blogId =
      title.toLowerCase().split(" ").join("-") + "-" + randomUUID();

    // Create a new blog post
    const blog = await Blog.create({
      description,
      title,
      draft,
      creator,
      image: secure_url,
      imageId: public_id,
      blogId,
    });

    await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });

    return res.status(200).json({
      message: "Blog created Successfully",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({ message: error.message });
  }
}

// async function getBlogs(req, res) {
//   try {
//     // const blogs = await Blog.find({ draft: false }).populate("creator");
//     const blogs = await Blog.find({ draft: false }).populate({
//       path: "creator",
//       select: "-password",
//     });

//     return res.status(200).json({
//       message: "Blogs fetched Successfully",
//       blogs,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// }

async function getBlogs(req, res) {
  try {
    // const blogs = await Blog.find({ draft: false }).populate("creator");
    const blogs = await Blog.find({ draft: false })
      .populate({
        path: "creator",
        select: "-password",
      })
      .populate({
        path: "likes",
        select: "email name",
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
    const { blogId } = req.params;
    const blog = await Blog.findOne({ blogId })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .populate({
        path: "creator",
        select: "name email",
      });

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

async function updateBlog(req, res) {
  try {
    const creator = req.user;
    // console.log(creator);
    const { id } = req.params;

    const { title, description, draft } = req.body;

    const image = req.file;

    // const user = await User.findById(creator).select("-password");
    // console.log(user);

    // console.log(user.blogs.find((blogId) => blogId === id));

    const blog = await Blog.findOne({ blogId: id });

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    if (!(creator == blog.creator)) {
      return res.status(500).json({
        message: "You are not authorized for this action",
      });
    }

    // const updatedBlog = await Blog.updateOne(
    //     { _id: id },
    //     {
    //         title,
    //         description,
    //         draft,
    //     },
    // );

    if (image) {
      await deleteImagefromCloudinary(blog.imageId);
      const { secure_url, public_id } = await uploadImage(image.path);
      blog.image = secure_url;
      blog.imageId = public_id;
      fs.unlinkSync(image.path);
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.draft = draft || blog.draft;

    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }

    if (creator != blog.creator) {
      return res.status(500).json({
        message: "You are not authorized for this action",
      });
    }

    await Blog.findByIdAndDelete(id);
    await User.findByIdAndUpdate(creator, { $pull: { blogs: id } });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function likeBlog(req, res) {
  try {
    const creator = req.user;
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(500).json({
        message: "Blog is not found",
      });
    }
    // console.log(blog.likes);
    // console.log(blog.likes.includes(creator));

    if (!blog.likes.includes(creator)) {
      await Blog.findByIdAndUpdate(id, { $push: { likes: creator } });
      return res.status(200).json({
        success: true,
        message: "Blog Liked successfully",
        isLiked: true,
      });
    } else {
      await Blog.findByIdAndUpdate(id, { $pull: { likes: creator } });
      return res.status(200).json({
        success: true,
        message: "Blog DisLiked successfully",
        isLiked: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}
module.exports = {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
  likeBlog,
};
