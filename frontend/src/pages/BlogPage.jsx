import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";

const BlogPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
    creator: { name: "" }, // Ensure `creator` object is initialized to prevent errors
  });

  // Function to fetch blog by ID
  async function fetchBlogById() {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/blogs/${id}`);
      setBlogData(res.data.blog);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  }

  // Fetch blog data when the component mounts or id changes
  useEffect(() => {
    if (id) {
      fetchBlogById();
    }
  }, [id]);

  return (
    <div className="w-[500px] mx-auto">
      {loading ? (
        <h1>Loading...</h1>
      ) : blogData ? (
        <div>
          <h1 className="mt-10 font-bold text-6xl capitalize">
            {blogData.title}
          </h1>
          <h2 className="my-5 text-3xl">{blogData.creator.name}</h2>

          {blogData.image && (
            <img
              src={blogData.image}
              alt="Blog cover"
              className="w-full max-h-[400px] object-cover"
            />
          )}
          <p>{blogData.description}</p>
          <Link to={`/edit/${id}`}>
            <button className="bg-green-400 mt-5 px-6 py-2 text-xl rounded">
              Edit
            </button>
          </Link>
        </div>
      ) : (
        <h1>No blog data found</h1>
      )}
    </div>
  );
};

export default BlogPage;
