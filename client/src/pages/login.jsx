import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAuth } from "../AuthContext";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    // Entrance animations
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
    );
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login", form);

      try {
        login(res.data.user);
      } catch (err) {
        console.error("Login: failed to set context, falling back to localStorage", err);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  // If already authenticated, send to home
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20"></div>
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <div className="inline-block mb-4 p-3 bg-purple-600/10 border-2 border-purple-500/30 rounded-xl">
            <LogIn size={32} className="text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold font-mono mb-2">/ login</h1>
          <p className="text-gray-500 font-mono text-sm">Access your developer portal</p>
        </div>

        {/* Form Card */}
        <div ref={formRef} className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/40 px-4 py-3 rounded-lg mb-6">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block mb-2 text-sm font-mono text-gray-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-black border-2 border-zinc-700 pl-10 pr-4 py-3 rounded-lg focus:border-purple-500/60 outline-none transition-colors font-mono text-sm placeholder-gray-600"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block mb-2 text-sm font-mono text-gray-400 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-black border-2 border-zinc-700 pl-10 pr-4 py-3 rounded-lg focus:border-purple-500/60 outline-none transition-colors font-mono text-sm placeholder-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors font-mono font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-800"></div>
            <span className="text-xs text-gray-500 font-mono">OR</span>
            <div className="flex-1 h-px bg-zinc-800"></div>
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400 font-mono">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Create one →
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 font-mono">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}