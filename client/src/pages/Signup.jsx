import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, GraduationCap, Code2, UserPlus, ArrowRight } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    year: "",
    domain: [],
  });

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

  const toggleDomain = (value) => {
    setForm((prev) => {
      const exists = prev.domain.includes(value);
      return {
        ...prev,
        domain: exists
          ? prev.domain.filter((d) => d !== value)
          : [...prev.domain, value],
      };
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/signup", form);

      // Save token & user
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate to private editable profile
      navigate(`/profile`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 py-12 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-20"></div>
      
      {/* Subtle gradient orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-8">
          <div className="inline-block mb-4 p-3 bg-purple-600/10 border-2 border-purple-500/30 rounded-xl">
            <UserPlus size={32} className="text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold font-mono mb-2">/ signup</h1>
          <p className="text-gray-500 font-mono text-sm">Join the developer community</p>
        </div>

        {/* Form Card */}
        <div ref={formRef} className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/40 px-4 py-3 rounded-lg mb-6">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name & Email - Two columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block mb-2 text-sm font-mono text-gray-400 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Name"
                    className="w-full bg-black border-2 border-zinc-700 pl-10 pr-4 py-3 rounded-lg focus:border-purple-500/60 outline-none transition-colors font-mono text-sm placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Email */}
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
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
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

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-sm font-mono text-gray-400 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-black border-2 border-zinc-700 pl-10 pr-4 py-3 rounded-lg focus:border-purple-500/60 outline-none transition-colors font-mono text-sm placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Branch & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch */}
              <div>
                <label className="block mb-2 text-sm font-mono text-gray-400 uppercase tracking-wide">
                  Branch
                </label>
                <div className="relative">
                  <GraduationCap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full bg-black border-2 border-zinc-700 pl-10 pr-4 py-3 rounded-lg focus:border-purple-500/60 outline-none transition-colors font-mono text-sm placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="block mb-2 text-sm font-mono text-gray-400 uppercase tracking-wide">
                  Year
                </label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full bg-black border-2 border-zinc-700 px-4 py-3 rounded-lg focus:border-purple-500/60 outline-none transition-colors font-mono text-sm appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                  }}
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
              </div>
            </div>

            {/* Domain Selection */}
            <div>
              <label className="block mb-3 text-sm font-mono text-gray-400 uppercase tracking-wide items-center gap-2">
                <Code2 size={18} />
                Domain Preference
              </label>

              <div className="grid grid-cols-3 gap-3">
                {["web", "app", "game"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDomain(d)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all font-mono text-sm uppercase font-bold ${
                      form.domain.includes(d)
                        ? "bg-purple-600 border-purple-500 text-white scale-105"
                        : "bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600"
                    }`}
                  >
                    {d}
                  </button>
                ))}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400 font-mono">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                Login →
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 font-mono">
            By signing up, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}