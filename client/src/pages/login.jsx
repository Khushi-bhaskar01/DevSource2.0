import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";
import { Lock } from "lucide-react";

export default function Login() {

  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    setLoading(true);
    setError("");

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
    if (!authLoading && isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col justify-center items-center px-6 font-inter">

      <div className="w-full max-w-sm">

        <header className="mb-16 text-center">

          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center rounded-full">
              <Lock className="text-premium-accent" size={18}/>
            </div>
          </div>

          <span className="text-zinc-600 font-black uppercase tracking-[0.4em] text-[9px] block mb-4">
            / SECURE_ACCESS
          </span>

          <h1 className="text-5xl font-black tracking-tighter uppercase">
            SYSTEM <span className="text-zinc-800">LOGIN</span>.
          </h1>

        </header>

        {error && (
          <div className="py-4 px-6 bg-red-500/5 border border-red-500/10 text-[9px] font-black uppercase tracking-widest text-red-500 text-center mb-6">
            AUTH_FAILURE
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-premium-accent hover:text-white transition-all"
        >
          {loading ? "AUTHENTICATING..." : "LOGIN WITH GOOGLE"}
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 hover:text-white w-full"
        >
          NO_IDENTITY? INIT_SIGNUP_FLOW
        </button>

      </div>

      <div className="absolute bottom-12 text-[8px] font-black text-zinc-900 uppercase tracking-[1em]">
        ENCRYPTED_SESSION_v2.0
      </div>

    </div>
  );
}