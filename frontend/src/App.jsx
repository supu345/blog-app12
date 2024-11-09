import { Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signin" element={<AuthForm type={"signin"} />}></Route>
        <Route path="/signup" element={<AuthForm type={"signup"} />}></Route>
        <Route path="/add-blog" element={<AddBlog />}></Route>
        <Route path="/blog/:id" element={<BlogPage />}></Route>
        <Route path="/edit/:id" element={<AddBlog />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
