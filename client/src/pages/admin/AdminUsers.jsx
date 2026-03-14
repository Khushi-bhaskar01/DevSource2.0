import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosInstance";
import { motion } from "framer-motion";
import {
  Search,
  Award,
  Mail,
  GraduationCap,
  ShieldAlert,
  SearchIcon,
  Filter
} from "lucide-react";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!authUser?._id || (authUser.role !== "admin" && authUser.role !== "superadmin")) {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterRole !== "all") {
      filtered = filtered.filter(u => u.role === filterRole);
    }
    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, users]);

  const fetchUsers = async () => {
    try {
      setError("");
      const res = await api.get("/api/user/data");
      let allUsers = [];
      if (res.data?.members) {
        const { webDev = [], gameDev = [], appDev = [], other = [] } = res.data.members;
        const userMap = new Map();
        [...webDev, ...gameDev, ...appDev, ...other].forEach(u => u._id && userMap.set(u._id.toString(), u));
        allUsers = Array.from(userMap.values());
      }
      setUsers(allUsers.sort((a, b) => (b.points || 0) - (a.points || 0)));
    } catch (err) {
      setError("MEMBER_FETCH_FAILED");
    } finally {
      setLoading(false);
    }
  };

   const handleRoleChange = async (targetUser, newRole) => {
    if (!window.confirm(`CONFIRM_${newRole.toUpperCase()}_ELEVATION?`)) return;
    try {
      const endpoint = newRole === "admin" ? "/api/superadmin/add-admin" : "/api/superadmin/remove-admin";
      await api.post(endpoint, { email: targetUser.email });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "AUTHORIZATION_FAILURE");
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-[10px]">
       QUERYING_IDENTITIES...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08080a] text-white selection:bg-premium-accent/30 font-inter">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
               <ShieldAlert className="text-premium-accent" size={16} />
               <span className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">/ IDENTITY_MANAGER</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              ACCESS <span className="text-zinc-800">ARCHIVE</span>.
            </h1>
          </div>
        </header>

        {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
               PROTOCOL_FAILURE:: {error}
            </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 mb-12">
           <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-premium-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="PROBE_IDENTITY..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/2 border border-white/5 py-5 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-white/20 transition-all text-white"
              />
           </div>
           <div className="flex items-center gap-4 bg-white/2 border border-white/5 px-8">
              <Filter className="text-zinc-700" size={14} />
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-transparent py-5 text-[10px] font-black uppercase tracking-widest outline-none"
              >
                 <option value="all">ALL_PERMISSIONS</option>
                 <option value="student">STUDENT_UNITS</option>
                 <option value="admin">ADMINS</option>
              </select>
           </div>
        </div>

        <div className="border border-white/5 bg-white/2 backdrop-blur-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/5 uppercase text-[9px] font-black tracking-[0.3em] text-zinc-600">
                       <th className="p-8">IDENTITY</th>
                       <th className="p-8">DOMAIN_ACCESS</th>
                       <th className="p-8">XP_METRICS</th>
                       <th className="p-8 text-right">PROTOCOL</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filteredUsers.map((user, idx) => (
                       <tr key={user._id} className="border-b border-white/5 group hover:bg-white/5 transition-all">
                          <td className="p-8">
                             <div className="flex items-center gap-6">
                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-white group-hover:border-premium-accent group-hover:text-premium-accent transition-all">
                                   {user.name?.[0].toUpperCase()}
                                </div>
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-black uppercase tracking-tight text-white group-hover:text-premium-accent transition-colors">{user.name}</p>
                                      {user.role === 'admin' && <span className="text-[7px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1">ADMIN</span>}
                                      {user.role === 'superadmin' && <span className="text-[7px] font-black bg-premium-accent/10 text-premium-accent border border-premium-accent/20 px-1">ROOT</span>}
                                   </div>
                                   <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-8">
                             <div className="flex flex-wrap gap-2">
                                {user.domain?.map(d => (
                                   <span key={d} className="px-3 py-1 bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                                      {d}
                                   </span>
                                ))}
                                {(!user.domain || user.domain.length === 0) && <span className="text-[9px] font-black text-zinc-800 tracking-widest">UNASSIGNED</span>}
                             </div>
                          </td>
                          <td className="p-8">
                             <div className="flex items-center gap-2 text-white font-black text-lg">
                                <Award size={14} className="text-premium-accent" />
                                {user.points || 0}
                             </div>
                          </td>
                          <td className="p-8 text-right">
                             <div className="flex flex-col items-end gap-2">
                                <button onClick={() => navigate(`/profile/${user._id}`)} className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white flex items-center gap-2 group/btn">
                                   VIEW_DOSSIER
                                   <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" size={12} />
                                </button>
                                
                                {authUser?.role === "superadmin" && user.role !== "superadmin" && (
                                   <>
                                      {user.role === "admin" ? (
                                         <button 
                                           onClick={() => handleRoleChange(user, "student")}
                                           className="text-[8px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors"
                                         >
                                            REVOKE_ADMIN_ACCESS
                                         </button>
                                      ) : (
                                         <button 
                                           onClick={() => handleRoleChange(user, "admin")}
                                           className="text-[8px] font-black uppercase tracking-widest text-blue-500/50 hover:text-blue-500 transition-colors"
                                         >
                                            ELEVATE_TO_ADMIN
                                         </button>
                                      )}
                                   </>
                                )}
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </main>
    </div>
  );
}