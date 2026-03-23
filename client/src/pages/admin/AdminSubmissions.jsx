import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Filter,
  User,
  ShieldAlert,
  X,
  ChevronRight
} from "lucide-react";

export default function AdminSubmissions() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, submissionId: null, action: null });
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!authUser?._id || (authUser.role !== "admin" && authUser.role !== "superadmin")) {
      navigate("/");
      return;
    }
    fetchSubmissions();
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    let filtered = submissions;
    if (filterStatus !== "all") {
      const statusMap = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
      filtered = filtered.filter((s) => s.status === statusMap[filterStatus]);
    }
    setFilteredSubmissions(filtered);
  }, [filterStatus, submissions]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/submissions");
      const data = Array.isArray(res.data) ? res.data : res.data?.submissions || [];
      setSubmissions(data.sort((a, b) => (a.status === "Pending" ? -1 : 1)));
    } catch (err) {
      setError("LOAD_FAILED");
    } finally {
       setLoading(false);
    }
  };

  const handleReview = async (submissionId, newStatus) => {
    setProcessingId(submissionId);
    try {
      const payload = { 
        status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        feedback: feedbackText.trim()
      };
      await api.put(`/api/submissions/${submissionId}`, payload);
      setFeedbackModal({ open: false, submissionId: null, action: null });
      fetchSubmissions();
    } catch (err) {
      setError("UPDATE_FAILED");
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-[10px]">
       DECODING_TRANSMISSIONS...
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
               <span className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">/ INBOUND_REPORTS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
              REVIEW <span className="text-zinc-800">LOGS</span>.
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white/2 border border-white/5 px-6 py-4">
             <Filter size={14} className="text-zinc-700" />
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none"
             >
                <option value="all">ALL_REPORTS</option>
                <option value="pending">PENDING</option>
                <option value="approved">APPROVED</option>
                <option value="rejected">REJECTED</option>
             </select>
          </div>
        </header>

        <div className="space-y-4">
           {filteredSubmissions.map((s) => (
             <div key={s._id} className="bg-white/2 border border-white/5 group hover:bg-white/5 transition-all p-8 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="flex-1 space-y-6">
                   <div className="flex flex-wrap items-center gap-6">
                      <div className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest border ${
                        s.status === 'Pending' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' :
                        s.status === 'Approved' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                        'text-red-500 border-red-500/20 bg-red-500/5'
                      }`}>
                         {s.status}
                      </div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white">{s.taskId?.title || "DELETED_TASK"}</h3>
                   </div>
                   
                   <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      <div className="flex items-center gap-2">
                         <User size={12} className="text-premium-accent" />
                         <span>{s.userId?.name || "ANONYMOUS"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Clock size={12} />
                         <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <a 
                        href={s.submissionLink ? (s.submissionLink.startsWith("http") ? s.submissionLink : `https://${s.submissionLink}`) : "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-premium-accent transition-colors"
                      >
                         <ExternalLink size={12} />
                         OPEN_ASSET
                      </a>
                   </div>
                </div>

                {s.status === 'Pending' && (
                  <div className="flex gap-4">
                     <button onClick={() => setFeedbackModal({ open: true, submissionId: s._id, action: "approved" })} className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-[9px] hover:bg-green-500 hover:text-white transition-all">APPROVE</button>
                     <button onClick={() => setFeedbackModal({ open: true, submissionId: s._id, action: "rejected" })} className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[9px] hover:bg-red-500 transition-all">REJECT</button>
                  </div>
                )}
             </div>
           ))}
        </div>
      </main>

      <AnimatePresence>
         {feedbackModal.open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
               <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} className="bg-[#0c0c0e] border border-white/10 w-full max-w-lg p-12 relative">
                  <button onClick={() => setFeedbackModal({ open: false, submissionId: null, action: null })} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
                     <X size={20} />
                  </button>
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">REPORT_FEEDBACK</h2>
                  <textarea 
                    rows={4}
                    placeholder="PROVIDE ARCHIVE NOTES..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full bg-black border border-white/10 p-5 text-xs font-inter uppercase leading-relaxed outline-none resize-none mb-8" 
                  />
                  <button 
                    onClick={() => handleReview(feedbackModal.submissionId, feedbackModal.action)}
                    className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[10px] transition-all ${
                      feedbackModal.action === 'approved' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                     {processingId ? "UPLOADING..." : "CONFIRM_ACTION"}
                  </button>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}