import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
//import { useDispatch } from "react-redux";
//import { login } from "../utils/userSilce";

function AuthForm({ type }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleAuthForm(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/${type}`,
        userData
      );

      // Check if the response contains both user and token
      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error("Token or user data missing in response");
      }

      // Save user and token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <h1 className="text-3xl">{type === "signin" ? "Sign in" : "Sign up"}</h1>
      <form
        className="w-[300px] flex flex-col items-center gap-5"
        onSubmit={handleAuthForm}
      >
        {type === "signup" && (
          <input
            type="text"
            className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
            placeholder="Enter your name"
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        )}

        <input
          type="email"
          className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
          placeholder="Enter your email"
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />
        <input
          type="password"
          className="w-full h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500"
          placeholder="Enter your password"
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
        />
        <button className="w-[150px] h-[50px] text-white text-xl p-2 rounded-md focus:outline-none bg-gray-500">
          {type === "signin" ? "Login" : "Register"}
        </button>
      </form>

      {type === "signin" ? (
        <p>
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-blue-500">
            Sign up
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <Link to={"/signin"} className="text-blue-500">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}

export default AuthForm;
