import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Calendar,
  Award,
  Tag,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

export default function AdminTasks() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    domain: "web",
    title: "",
    description: "",
    points: "",
    teamName: "",
    deployedLink: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!authUser?._id || (authUser.role !== "admin" && authUser.role !== "superadmin")) {
      navigate("/");
      return;
    }
    fetchTasks();
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    let filtered = tasks;
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterDomain !== "all") {
      filtered = filtered.filter(t => t.domain === filterDomain);
    }
    setFilteredTasks(filtered);
  }, [searchTerm, filterDomain, tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tasks");
      setTasks(Array.isArray(res.data) ? res.data : res.data?.tasks || []);
    } catch (err) {
      setError("FAILED_TO_FETCH_OBJECTIVES");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Distill payload (deadline removed)
      const payload = { 
        domain: form.domain,
        title: form.title,
        description: form.description,
        points: Number(form.points),
        teamName: form.teamName,
        deployedLink: form.deployedLink
      };
      
      if (editingTask) await api.put(`/api/tasks/${editingTask._id}`, payload);
      else await api.post("/api/tasks", payload);
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      setError("SAVE_OPERATION_FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("CONFIRM_DELETION?")) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("DELETE_OPERATION_FAILED");
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-[10px]">
       SYNCING_OBJECTIVES...
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
               <span className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">/ OBJECTIVE_MANAGER</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              MANAGE <span className="text-zinc-800">TASKS</span>.
            </h1>
          </div>
          <button 
            onClick={() => { setEditingTask(null); setForm({ domain: "web", title: "", description: "", points: "", teamName: "", deployedLink: "" }); setShowModal(true); }}
            className="px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-premium-accent hover:text-white transition-all flex items-center gap-4"
          >
            CREATE_NEW_ENTRY <Plus size={14} />
          </button>
        </header>

        {/* Tactical Toolbar */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
           <div className="flex-1 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-premium-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH_BY_KEYWORD..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/2 border border-white/5 py-5 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-white/20 transition-all"
              />
           </div>
           <select 
             value={filterDomain}
             onChange={(e) => setFilterDomain(e.target.value)}
             className="bg-black border border-white/5 px-8 py-5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-white/20"
           >
              <option value="all">ALL_DOMAINS</option>
              <option value="web">WEB_CORE</option>
              <option value="app">APP_SECTOR</option>
              <option value="game">GAME_ENGINE</option>
           </select>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 gap-4">
           {filteredTasks.map((task) => (
             <div key={task._id} className="bg-white/2 border border-white/5 group hover:bg-white/5 transition-all p-8 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-6">
                      <span className="text-[10px] font-black text-premium-accent uppercase tracking-widest">[{task.domain}]</span>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">{task.title}</h3>
                   </div>
                   <div className="flex flex-wrap gap-6">
                      <p className="text-xs text-zinc-500 font-inter uppercase leading-relaxed line-clamp-1">{task.description}</p>
                      {task.teamName && (
                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest border border-white/5 px-2 bg-white/5">TEAM: {task.teamName}</span>
                      )}
                   </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="text-right">
                      <p className="text-[8px] font-black text-zinc-800 uppercase tracking-widest mb-1">XP_PRIORITY</p>
                      <p className="text-sm font-black text-white">{task.points}</p>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => { setEditingTask(task); setForm({ ...task }); setShowModal(true); }} className="p-4 bg-white/5 hover:bg-blue-500/20 text-blue-400 border border-white/5 transition-all">
                         <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="p-4 bg-white/5 hover:bg-red-500/20 text-red-400 border border-white/5 transition-all">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {filteredTasks.length === 0 && (
           <div className="py-40 text-center border border-dashed border-white/5">
              <p className="text-[10px] font-black text-zinc-800 uppercase tracking-[1em]">NO_RECORDS_MATCH_QUERY</p>
           </div>
        )}
      </main>

      {/* Extreme Minimalist Modal */}
      <AnimatePresence>
         {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
               <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} className="bg-[#0c0c0e] border border-white/10 w-full max-w-2xl p-12 relative overflow-y-auto max-h-[90vh]">
                  <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
                     <X size={20} />
                  </button>
                  
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-12">
                    {editingTask ? "EDIT_OBJECTIVE" : "NEW_OBJECTIVE"}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                           <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-4">SECTOR</label>
                           <select 
                             value={form.domain}
                             onChange={(e) => setForm({...form, domain: e.target.value})}
                             className="w-full bg-black border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none"
                           >
                              <option value="web">WEB_CORE</option>
                              <option value="app">APP_SECTOR</option>
                              <option value="game">GAME_ENGINE</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-4">PRIORITY_XP</label>
                           <input 
                             type="number" 
                             required
                             value={form.points}
                             onChange={(e) => setForm({...form, points: e.target.value})}
                             className="w-full bg-black border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none" 
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                           <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-4">TEAM_IDENTIFIER</label>
                           <input 
                             type="text" 
                             placeholder="STRIKE_FORCE_01..."
                             value={form.teamName}
                             onChange={(e) => setForm({...form, teamName: e.target.value})}
                             className="w-full bg-black border border-white/5 p-4 text-xs font-black uppercase tracking-widest outline-none" 
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-4">DEPLOYED_ASSET_LINK</label>
                           <input 
                             type="text" 
                             placeholder="HTTPS://DEPLOYED-SYSTEM.COM"
                             value={form.deployedLink}
                             onChange={(e) => setForm({...form, deployedLink: e.target.value})}
                             className="w-full bg-black border border-white/10 p-4 text-xs font-black uppercase tracking-widest outline-none" 
                           />
                        </div>
                     </div>
                     
                     <div>
                        <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-4">TITLE</label>
                        <input 
                          type="text" 
                          required
                          value={form.title}
                          onChange={(e) => setForm({...form, title: e.target.value})}
                          className="w-full bg-black border border-white/10 p-5 text-xl font-black uppercase tracking-tight outline-none" 
                        />
                     </div>

                     <div>
                        <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest block mb-4">MISSION_DOSSIER</label>
                        <textarea 
                          rows={4}
                          required
                          value={form.description}
                          onChange={(e) => setForm({...form, description: e.target.value})}
                          className="w-full bg-black border border-white/10 p-5 text-sm font-inter uppercase leading-relaxed outline-none resize-none" 
                        />
                     </div>

                     <button 
                       type="submit" 
                       disabled={submitting}
                       className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-premium-accent hover:text-white transition-all"
                     >
                        {submitting ? "EXECUTING..." : "COMMIT_CHANGES"}
                     </button>
                  </form>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}