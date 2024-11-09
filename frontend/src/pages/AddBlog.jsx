import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function AddBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
  });

  // Dummy token for testing
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q1QGdtYWlsLmNvbSIsImlkIjoiNjcyZTQxNmI3MzgwZDUxZmQzM2Y4NDU0IiwiaWF0IjoxNzMxMDg3OTIwfQ.tzLpYRWKtQ03XVhDBd15GQYfXbnVN4e7m1juz_7yDXU";

  // Function to handle posting a new blog
  const handlePostBlog = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    if (blogData.image) {
      formData.append("image", blogData.image);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/blogs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        if (error.response.data.message.includes("Invalid token format")) {
          toast.error("Invalid token format. Please sign in again.");
        } else {
          toast.error(error.response.data.message || "Something went wrong");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  // Function to handle updating a blog
  const handleUpdateBlog = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    if (blogData.image && typeof blogData.image !== "string") {
      formData.append("image", blogData.image);
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/v1/blogs/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to update blog");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-[500px] mx-auto">
      <label htmlFor="">Title</label>
      <input
        type="text"
        placeholder="title"
        onChange={(e) =>
          setBlogData((prev) => ({
            ...prev,
            title: e.target.value,
          }))
        }
        value={blogData.title}
      />
      <br />
      <label htmlFor="">Description</label>
      <input
        type="text"
        placeholder="description"
        onChange={(e) =>
          setBlogData((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
        value={blogData.description}
      />
      <br />
      <div>
        <label htmlFor="image">
          {blogData.image ? (
            <img
              src={
                typeof blogData.image === "string"
                  ? blogData.image
                  : URL.createObjectURL(blogData.image)
              }
              alt=""
              className="aspect-video object-cover"
            />
          ) : (
            <div className="bg-slate-500 aspect-video flex justify-center items-center text-4xl">
              Select Image
            </div>
          )}
        </label>
        <input
          className="hidden"
          id="image"
          type="file"
          accept=".png, .jpeg, .jpg"
          onChange={(e) =>
            setBlogData((prev) => ({
              ...prev,
              image: e.target.files[0],
            }))
          }
        />
      </div>
      <br />
      <button onClick={id ? handleUpdateBlog : handlePostBlog}>
        {id ? "Update Blog" : "Post Blog"}
      </button>
    </div>
  );
}

export default AddBlog;
