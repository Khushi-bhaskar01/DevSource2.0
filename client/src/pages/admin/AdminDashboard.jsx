import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosInstance";
import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!authUser?._id || (authUser.role !== "admin" && authUser.role !== "superadmin")) {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        setError("");
        const [usersRes, tasksRes, submissionsRes] = await Promise.all([
          api.get("/api/user/data").catch(() => ({ data: { members: {} } })),
          api.get("/api/tasks").catch(() => ({ data: [] })),
          api.get("/api/submissions").catch(() => ({ data: [] })),
        ]);

        let totalUsers = resCountMembers(usersRes.data);
        const tasks = tasksRes.data?.tasks || tasksRes.data || [];
        const submissions = submissionsRes.data?.submissions || submissionsRes.data || [];

        setStats({
          totalUsers,
          totalTasks: tasks.length,
          totalSubmissions: submissions.length,
          pendingSubmissions: submissions.filter(s => s.status?.toLowerCase() === "pending").length,
          approvedSubmissions: submissions.filter(s => s.status?.toLowerCase() === "approved").length,
          rejectedSubmissions: submissions.filter(s => s.status?.toLowerCase() === "rejected").length,
        });
      } catch (err) {
        setError("DATA_SYNC_ERROR");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authUser, authLoading, navigate]);

  const resCountMembers = (data) => {
    if (!data?.members) return 0;
    const { webDev = [], gameDev = [], appDev = [], other = [] } = data.members;
    const uniqueIds = new Set([...webDev, ...gameDev, ...appDev, ...other].map(u => u._id));
    return uniqueIds.size;
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-[10px]">
       <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
          INIT_SYSTEM_DASHBOARD...
       </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08080a] text-white selection:bg-premium-accent/30 font-inter">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        {/* Superior Header */}
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/5 pb-12">
          <div className="max-w-2xl relative">
            <div className="flex items-center gap-3 mb-6">
               <ShieldCheck className="text-premium-accent" size={16} />
               <span className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">/ COMMAND CENTER</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              SYSTEM <span className="text-zinc-800">OVERVIEW</span>.
            </h1>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1">OPERATOR_IDENTITY</p>
             <p className="text-xs font-black text-white uppercase">{authUser?.name}</p>
          </div>
        </header>

        {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
               SYSTEM_ERROR:: {error}
            </div>
        )}

        {/* Compact Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 mb-12">
            {[
              { label: "Archived Identities", val: stats.totalUsers, icon: Users, color: "text-blue-400" },
              { label: "Active Objectives", val: stats.totalTasks, icon: ClipboardList, color: "text-purple-400" },
              { label: "Inbound Reports", val: stats.totalSubmissions, icon: TrendingUp, color: "text-pink-400" },
              { label: "Priority Review", val: stats.pendingSubmissions, icon: Clock, color: "text-yellow-400" }
            ].map((stat, i) => (
              <div key={i} className="bg-black p-8 group hover:bg-zinc-900 transition-all duration-500">
                <div className="flex items-center justify-between mb-8">
                   <stat.icon className={`${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} size={20} />
                   <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">METRIC_0{i+1}</span>
                </div>
                <p className="text-3xl font-black mb-1">{stat.val}</p>
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
        </div>

        {/* Tactical Sub-Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Section: Status Breakdown */}
           <div className="lg:col-span-1 bg-white/2 border border-white/5 p-8 backdrop-blur-md">
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-10">/ REGISTRY STATUS</span>
              <div className="space-y-6">
                 {[
                   { label: "APPROVED", count: stats.approvedSubmissions, color: "bg-green-500" },
                   { label: "PENDING", count: stats.pendingSubmissions, color: "bg-yellow-500" },
                   { label: "REJECTED", count: stats.rejectedSubmissions, color: "bg-red-500" }
                 ].map((item) => (
                   <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-sm font-black text-white">{item.count}</span>
                   </div>
                 ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/5">
                 <button onClick={() => navigate("/admin/submissions")} className="w-full group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:bg-premium-accent hover:border-premium-accent transition-all text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white text-zinc-400">REVIEW LOGS</span>
                    <ChevronRight size={14} className="text-zinc-700 group-hover:text-white" />
                 </button>
              </div>
           </div>

           {/* Section: Quick Access Controls */}
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Task Protocol", desc: "Manage mission objectives and deployments.", path: "/admin/tasks", icon: ClipboardList, accent: "border-purple-500/20" },
                { label: "Identity Archive", desc: "Monitor student records and access logs.", path: "/admin/users", icon: Users, accent: "border-blue-500/20" }
              ].map((action) => (
                <button 
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`bg-black p-10 text-left border border-white/5 hover:border-premium-accent transition-all group relative overflow-hidden`}
                >
                   <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                      <action.icon size={80} />
                   </div>
                   <span className="text-[10px] font-black text-premium-accent uppercase tracking-widest block mb-4">CONTROL_NODE</span>
                   <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{action.label}</h3>
                   <p className="text-xs text-zinc-600 font-inter uppercase leading-relaxed mb-10">{action.desc}</p>
                   <div className="flex items-center gap-2 group-hover:gap-4 transition-all">
                      <div className="w-8 h-px bg-white/10 group-hover:bg-premium-accent" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-800 group-hover:text-white">ACCESS_MODULE</span>
                   </div>
                </button>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}