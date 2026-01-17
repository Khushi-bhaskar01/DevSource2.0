import React, { useState } from "react";
import {useAuth} from "../AuthContext";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use the shared API instance so cookies (httpOnly token) are set
      const res = await api.post("/api/auth/login", form);

      // update context (persist user and token)
      try {
        login(res.data.user);
      } catch (err) {
        console.error("Login: failed to set context, falling back to localStorage", err);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Redirect to home after successful login
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  // If already authenticated, send to home
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md">

        <h2 className="text-3xl font-bold text-center mb-6 font-[Zen_Dots]">
          Login
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-[Zen_Dots]">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#ff81cc] outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-[Zen_Dots]">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#ff81cc] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[#ff81cc] hover:bg-[#ff64b8] transition font-[Zen_Dots]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#ff81cc] hover:underline cursor-pointer"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}
