import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";
import api from "../api/axiosInstance";
import { motion } from "framer-motion";
import { User, Mail, Link, Layout, Save, X } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { user, loading: authLoading, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    aboutMe: "",
    linkedin: "",
    github: "",
    profilePicture: "",
    year: "",
    branch: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        aboutMe: user.aboutMe || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        profilePicture: user.profilePicture || "",
        year: user.year || "",
        branch: user.branch || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await api.put(`/api/user/${user._id}`, form);
      // res.data should contain the updated user
      const updatedUser = res.data.user || res.data;
      setUser(prev => ({ ...prev, ...updatedUser }));
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-[10px]">
       SYNCING_PROFILE_CONFIG...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-premium-accent/30 font-inter">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-40 pb-20">
        <header className="mb-20 border-b border-white/5 pb-10">
          <span className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[9px] block mb-4">/ CONFIGURATION</span>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
            IDENTITY <span className="text-zinc-800">SETTINGS</span>.
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Identity */}
          <div>
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-8">IDENTITY_CORE</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-2">ARCHITECT NAME</label>
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-white/2 border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-white/20 transition-all"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-2">AVATAR URL</label>
                  <input 
                    type="text" 
                    value={form.profilePicture}
                    onChange={(e) => setForm({...form, profilePicture: e.target.value})}
                    className="w-full bg-white/2 border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-white/20 transition-all font-mono"
                    placeholder="HTTPS://..."
                  />
               </div>
            </div>
          </div>

          {/* Section: Dossier */}
          <div>
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-8">DOSSIER_MANIFEST</span>
            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-2">ABOUT THE IDENTITY</label>
                  <textarea 
                    rows={4}
                    value={form.aboutMe}
                    onChange={(e) => setForm({...form, aboutMe: e.target.value})}
                    className="w-full bg-white/2 border border-white/5 p-4 text-xs font-inter uppercase tracking-wide leading-relaxed outline-none focus:border-white/20 transition-all resize-none"
                    placeholder="MISSION STATEMENT..."
                  />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-2">ACADEMIC YEAR</label>
                     <input 
                       type="text" 
                       value={form.year}
                       onChange={(e) => setForm({...form, year: e.target.value})}
                       className="w-full bg-white/2 border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-white/20 transition-all"
                       placeholder="E.G. 2ND YEAR"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-2">BRANCH / SECTOR</label>
                     <input 
                       type="text" 
                       value={form.branch}
                       onChange={(e) => setForm({...form, branch: e.target.value})}
                       className="w-full bg-white/2 border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-white/20 transition-all"
                       placeholder="E.G. CSE"
                     />
                  </div>
               </div>
            </div>
          </div>

          {/* Section: External Channels */}
          <div>
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-8">EXTERNAL_CHANNELS</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-2">LINKEDIN PROFILE</label>
                  <input 
                    type="url" 
                    value={form.linkedin}
                    onChange={(e) => setForm({...form, linkedin: e.target.value})}
                    className="w-full bg-white/2 border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-white/20 transition-all font-mono"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block ml-2">GITHUB ARCHIVE</label>
                  <input 
                    type="url" 
                    value={form.github}
                    onChange={(e) => setForm({...form, github: e.target.value})}
                    className="w-full bg-white/2 border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none focus:border-white/20 transition-all font-mono"
                  />
               </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
             {error && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">ERROR: {error}</p>}
             {success && <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">PROTOCOL_UPDATED_SUCCESSFULLY</p>}
             <div className="flex gap-4 ml-auto">
                <button 
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-10 py-5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all"
                >
                  ABORT
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-premium-accent hover:text-white transition-all"
                >
                  {loading ? "SAVING..." : "COMMIT_CHANGES"}
                </button>
             </div>
          </div>
        </form>
      </main>
    </div>
  );
}
