import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import api from "../api/axiosInstance";
import { Award, TrendingUp, Cpu } from "lucide-react";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/api/leaderboard");
        setUsers(res.data.leaderboard || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-[10px]">
       SYNCING_NETWORK_XP...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-premium-accent/30 font-inter">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 pt-40 pb-20">
        <header className="mb-24 border-b border-white/5 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <span className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[9px] block mb-4">/ PERFORMANCE</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              GLOBAL <span className="text-zinc-600">RANK</span>.
            </h1>
          </div>
          <div className="text-right">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">LIVE_AUTH_IDENTS</span>
             <p className="text-xs font-black text-white uppercase">{users.length} REGISTERED</p>
          </div>
        </header>

        <div className="border border-white/5 bg-white/2 backdrop-blur-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/5 uppercase text-[9px] font-black tracking-[0.3em] text-zinc-700">
                       <th className="p-8">RANK</th>
                       <th className="p-8">IDENTITY</th>
                       <th className="p-8">SECTOR</th>
                       <th className="p-8 text-right">TOTAL_XP</th>
                    </tr>
                 </thead>
                 <tbody>
                    {users.map((user, idx) => (
                       <motion.tr 
                          key={user._id}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          className="border-b border-white/2 group hover:bg-white/5 transition-all"
                       >
                          <td className="p-8">
                             <span className={`text-[10px] font-black ${idx === 0 ? 'text-premium-accent' : 'text-zinc-600 group-hover:text-white'} transition-colors`}>
                                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                             </span>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-full border border-white/5 bg-white/2 flex items-center justify-center font-black text-xs text-zinc-500 group-hover:border-premium-accent group-hover:text-premium-accent transition-all">
                                   {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:translate-x-1 transition-transform">{user.name}</h3>
                             </div>
                          </td>
                          <td className="p-8">
                             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{user.branch || "CORE"}</span>
                          </td>
                          <td className="p-8 text-right">
                             <span className={`text-xl font-black ${idx === 0 ? 'text-premium-accent' : 'text-white'}`}>
                                {user.points.toLocaleString()}
                             </span>
                          </td>
                       </motion.tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Tactical Metrics Footing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 mt-24">
           {[
             { label: "COLLECTIVE XP", val: users.reduce((acc, u) => acc + (u.points || 0), 0).toLocaleString() },
             { label: "TOP AGENT", val: users[0]?.name.toUpperCase() || "N/A" },
             { label: "NETWORK_AVG", val: Math.round(users.reduce((acc, u) => acc + (u.points || 0), 0) / (users.length || 1)).toLocaleString() }
           ].map((stat) => (
              <div key={stat.label} className="bg-black p-10 group">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-4">{stat.label}</span>
                 <p className="text-2xl font-black text-white group-hover:text-premium-accent transition-colors">{stat.val}</p>
              </div>
           ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}