import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-lg bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-md">

        <h2 className="text-3xl font-bold text-center mb-6 font-[Zen_Dots]">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block mb-1 font-[Zen_Dots]">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#ff81cc] outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-[Zen_Dots]">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#ff81cc] outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-[Zen_Dots]">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#ff81cc] outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-[Zen_Dots]">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#ff81cc] outline-none"
              required
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block mb-1 font-[Zen_Dots]">Branch</label>
            <input
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="CSE / IT / AIML / AI / ECE..."
              className="w-full bg-black/30 border border-white/20 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#ff81cc] outline-none"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block mb-1 font-[Zen_Dots]">Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full bg-black/30 border border-white/20 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#ff81cc] outline-none"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          {/* Domain Selection */}
          <div>
            <label className="block mb-2 font-[Zen_Dots]">Domain Preference</label>

            <div className="flex gap-3">
              {["web", "app", "game"].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDomain(d)}
                  className={`px-4 py-2 rounded-xl border transition font-[Zen_Dots]
                    ${
                      form.domain.includes(d)
                        ? "bg-[#ff81cc] border-[#ff81cc] text-black"
                        : "border-white/30 text-white hover:border-[#ff81cc]"
                    }`}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[#ff81cc] hover:bg-[#ff64b8] transition font-[Zen_Dots]"
          >
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#ff81cc] hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
