import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Hash, Github, Linkedin, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axiosInstance";
import Footer from "../components/Footer";

const Members = () => {
  const [members, setMembers] = useState({
    webDev: [],
    gameDev: [],
    appDev: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get("/api/user/public");
        if (res.data.success) {
          setMembers(res.data.members);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const allMembersList = useMemo(() => {
    const list = [...members.webDev, ...members.gameDev, ...members.appDev, ...members.other];
    return list.filter(m => 
      m.role !== 'admin' && 
      m.role !== 'superadmin' &&
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => (b.points || 0) - (a.points || 0));
  }, [members, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-[10px]">
        SCANNING_DATABASE...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-premium-accent/30 font-inter">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-40 pb-40">
        <header className="mb-24 border-b border-white/5 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <span className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[9px] block mb-4">/ DIRECTORY</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              THE <span className="text-zinc-600 transition-colors hover:text-white">UNITS</span>.
            </h1>
          </div>
          <div className="relative w-full md:w-64 group text-2xl">
            <input 
              type="text" 
              placeholder="FILTER_BY_NAME..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-white/30 transition-all font-black uppercase tracking-widest text-[9px]"
            />
          </div>
        </header>

        {/* Extreme Minimalist List View */}
        <div className="divide-y divide-white/5 border-t border-b border-white/5">
           {allMembersList.map((member, idx) => (
             <motion.div 
               key={member._id}
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               className="group grid grid-cols-1 md:grid-cols-12 items-center py-6 hover:bg-white/2 transition-all px-4"
             >
                <div className="md:col-span-1 text-[9px] font-black text-zinc-600 group-hover:text-premium-accent transition-colors">
                   {idx + 1 < 10 ? `0${idx+1}` : idx+1}
                </div>
                
                <div className="md:col-span-5">
                   <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:translate-x-1 transition-transform inline-block">
                      {member.name}
                   </h3>
                </div>

                <div className="md:col-span-4 flex gap-2">
                   {member.domain?.map(d => (
                      <span key={d} className="text-[8px] font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 border border-white/5">
                         {d}
                      </span>
                   ))}
                </div>

                <div className="md:col-span-2 text-right">
                   <div className="flex items-center justify-end gap-5">
                      <span className="text-[10px] font-black text-white">{member.points} XP</span>
                      <div className="flex items-center gap-3">
                         {member.github && (
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-white transition-colors">
                               <Github size={13} />
                            </a>
                         )}
                         {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-white transition-colors">
                               <Linkedin size={13} />
                            </a>
                         )}
                         {!member.github && !member.linkedin && member.externalLink && (
                            <a href={member.externalLink} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:text-white transition-colors">
                               <ExternalLink size={13} />
                            </a>
                         )}
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {allMembersList.length === 0 && (
          <div className="py-40 text-center">
            <p className="font-black text-[9px] uppercase tracking-[1em] text-zinc-600">ZERO_MATCHES</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Members;
