import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate("/");
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-center items-center px-6 selection:bg-premium-accent/30 overflow-hidden relative font-inter">
      
      <div className="w-full max-w-sm z-10">
        <header className="mb-16 text-center">
          <div className="flex justify-center mb-6">
             <div className="w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center rounded-full">
                <Lock className="text-premium-accent" size={18} />
             </div>
          </div>
          <span className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[9px] block mb-4">
            / SECURE_ACCESS
          </span>
          <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
            SYSTEM <span className="text-zinc-800">LOGIN</span>.
          </h1>
        </header>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block ml-4 mb-2">IDENTITY_EMAIL</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/2 border border-white/5 p-5 text-sm font-black text-white outline-none focus:border-white/20 transition-all uppercase tracking-widest"
              placeholder="USR@DEVSOURCE.ARC"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest block ml-4 mb-2">ACCESS_KEY</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/2 border border-white/5 p-5 text-sm font-black text-white outline-none focus:border-white/20 transition-all uppercase tracking-widest"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="py-4 px-6 bg-red-500/5 border border-red-500/10 text-[9px] font-black uppercase tracking-widest text-red-500 text-center">
              AUTH_FAILURE: {error.split('/')[1]?.replace(/-/g, '_').toUpperCase() || "UNRECOGNIZED_IDENTITY"}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-premium-accent hover:text-white transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "AUTHENTICATING..." : "COMMIT_ACCESS_PROTOCOL"}
          </button>
        </form>

        <div className="mt-12 flex flex-col gap-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-4"
          >
            FEDERATED_LOGIN [GOOGLE]
          </button>
          
          <button
            onClick={() => navigate("/signup")}
            className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 hover:text-white transition-colors text-center"
          >
            NO_IDENTITY? <span className="text-zinc-500">INIT_SIGNUP_FLOW</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[8px] font-black text-zinc-900 uppercase tracking-[1em]">
        ENCRYPTED_SESSION_v2.0
      </div>
    </div>
  );
}