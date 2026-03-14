import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin, FaGithub, FaAward, FaEdit, FaLink, FaMapMarkerAlt, FaCode } from "react-icons/fa";
import { Terminal, Award, Cpu, ShieldCheck, LogOut, Share2, Check } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../AuthContext";
import { ScribbleDoodle, CircleDoodle } from "../components/Doodles";
import api from "../api/axiosInstance";
import { BADGES } from "../data/badgeConfig";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const copyPublicUrl = () => {
    const url = `${window.location.origin}/profile/${user._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate unlocked badges based on points
  const unlockedBadges = user 
    ? BADGES.filter(badge => (user.points || 0) >= badge.points)
    : [];

  useEffect(() => {
    const fetchUser = async () => {
      // Determine which ID to use: from URL params or from auth state
      const targetId = id || authUser?._id;
      
      if (!targetId) {
        if (!authLoading) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use public endpoint if id is in URL, otherwise use protected user endpoint
        const endpoint = id ? `/api/profile/${id}` : `/api/user/${targetId}`;
        const res = await api.get(endpoint);
        // Backend might return { success, user } or just user
        setUser(res.data.user || res.data);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      fetchUser();
    }
  }, [id, authUser, authLoading]);

  if (loading || authLoading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-xs">
      <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        Accessing Archive :: {id?.slice(-6).toUpperCase() || "OWN"}
      </motion.div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8">
       <h1 className="text-4xl font-black uppercase tracking-tighter">Identity Not Found</h1>
       <button onClick={() => navigate("/")} className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-accent border border-premium-accent/20 px-8 py-3 hover:bg-premium-accent hover:text-white transition-all">RETURN TO CORE</button>
    </div>
  );

  const isOwner = authUser?._id === user._id;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-premium-accent/30 font-inter">
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-3xl">
            <motion.span 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px] block mb-6"
            >
              / ARCHIVE :: {user._id.slice(-6).toUpperCase()}
            </motion.span>
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase leading-[0.85] relative">
              {user.name.split(' ')[0]} <span className="text-zinc-800">{user.name.split(' ')[1] || 'ARCHITECT'}</span>.
            </h1>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
             {isOwner && (
               <>
                 <button 
                  onClick={handleLogout}
                  className="p-4 rounded-full border border-red-500/20 text-red-500/50 hover:text-red-500 hover:border-red-500 transition-all group relative"
                  title="TERMINATE SESSION"
                 >
                   <LogOut size={18} />
                 </button>
                 <button 
                  onClick={() => navigate("/settings")}
                  className="p-4 rounded-full border border-white/10 hover:border-premium-accent hover:text-premium-accent transition-all group"
                  title="EDIT CONFIG"
                 >
                   <FaEdit size={18} />
                 </button>
               </>
             )}
             
             <button 
               onClick={copyPublicUrl}
               className={`p-4 rounded-full border transition-all flex items-center gap-3 group relative ${
                 copied ? "border-green-500 text-green-500" : "border-white/10 text-zinc-500 hover:border-white/30 hover:text-white"
               }`}
             >
               {copied ? <Check size={18} /> : <Share2 size={18} />}
               <AnimatePresence>
                 {copied && (
                   <motion.span 
                     initial={{ opacity: 0, x: 10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 10 }}
                     className="absolute -top-10 right-0 bg-green-500 text-black text-[8px] font-black py-1 px-3 uppercase tracking-widest whitespace-nowrap"
                   >
                     LINK_COPIED
                   </motion.span>
                 )}
               </AnimatePresence>
             </button>

             <div className="text-right ml-4 md:ml-8">
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-2">XP PRIORITY</span>
                <p className="text-3xl font-black text-white uppercase">{user.points?.toLocaleString() || 0}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/5 border border-white/5">
          {/* Portrait Column */}
          <div className="lg:col-span-4 bg-black p-12 flex flex-col items-center text-center space-y-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <CircleDoodle className="w-64 h-64" color="#ef5d47" />
             </div>
             
             <div className="relative w-64 h-64 rounded-full overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700 group">
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-6xl font-black text-white transition-all duration-500 group-hover:text-premium-accent">
                   {user.name.charAt(0).toUpperCase()}
                </div>
                {user.profilePicture && (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-premium-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>

             <div className="space-y-4 relative">
                <div className="flex items-center justify-center gap-2 mb-8">
                   <ShieldCheck className="text-premium-accent" size={16} />
                   <span className="text-[10px] font-black text-premium-accent uppercase tracking-widest">VERIFIED IDENTITY</span>
                </div>
                
                <div className="space-y-2">
                   <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">DOMAIN SECTOR</p>
                   <div className="flex flex-wrap justify-center gap-2">
                      {user.domain?.map(d => (
                         <span key={d} className="px-4 py-2 bg-zinc-900 border border-white/5 text-[10px] font-black uppercase tracking-widest">{d}</span>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Dossier Column */}
          <div className="lg:col-span-8 bg-black">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 h-full">
                <div className="p-12 space-y-12">
                   <div>
                      <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-6">/ ABOUT_ME</span>
                      <p className="text-zinc-400 text-sm leading-relaxed uppercase">
                        {user.aboutMe || "NO RECENT ACTIVITY OR DOSSIER ENTRIES FOR THIS IDENTITY. THE ARCHITECT PREFERS ANONYMITY WITHIN THE COLLECTIVE ARCHIVES."}
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-2">YEAR</span>
                         <p className="text-white font-black uppercase text-xs">{user.year || "UNKNOWN"}</p>
                      </div>
                      <div>
                         <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-2">BRANCH</span>
                         <p className="text-white font-black uppercase text-xs">{user.branch || "CORE"}</p>
                      </div>
                   </div>
                </div>

                <div className="p-12 space-y-12 border-l border-white/5">
                   <div>
                      <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-8">/ BADGE_ARCHIVE</span>
                      <div className="grid grid-cols-3 gap-6">
                         {unlockedBadges.length > 0 ? (
                            unlockedBadges.map((badge, i) => (
                               <motion.div 
                                 key={badge.id}
                                 whileHover={{ scale: 1.1 }}
                                 className="aspect-square bg-zinc-900 border border-white/5 rounded-lg flex flex-col items-center justify-center transition-all relative group p-2"
                               >
                                  <img src={badge.image} alt={badge.name} className="w-12 h-12 mb-2" />
                                  <span className="text-[8px] font-black text-white uppercase tracking-tighter text-center">{badge.name}</span>
                                </motion.div>
                            ))
                         ) : (
                            <div className="col-span-3 py-12 text-center border border-dashed border-white/5">
                               <p className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">NO AWARDS DEPLOYED</p>
                            </div>
                         )}
                      </div>
                   </div>

                   <div>
                      <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-8">/ EXTERNAL_LINKS</span>
                      <div className="flex gap-6">
                         {user.linkedin && (
                            <a href={user.linkedin} target="_blank" rel="noreferrer" className="p-4 bg-zinc-900 border border-white/5 hover:border-premium-accent transition-all">
                               <FaLinkedin size={18} />
                            </a>
                         )}
                         {user.github && (
                            <a href={user.github} target="_blank" rel="noreferrer" className="p-4 bg-zinc-900 border border-white/5 hover:border-premium-accent transition-all">
                               <FaGithub size={18} />
                            </a>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Global Position */}
        <div className="mt-24 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-12 opacity-30">
               {["ARCHITECT", "ENGINEER", "DEPLOYER"].map(tag => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-[0.6em]">{tag}</span>
               ))}
            </div>
            <div className="relative w-48 opacity-20">
               <ScribbleDoodle color="#ef5d47" />
            </div>
        </div>
      </main>

    </div>
  );
}