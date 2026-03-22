import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskSubmitModal({ open, onClose, onSubmit, task }) {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !task) return null;

  const handleSubmit = async () => {
    if (!link.trim()) return setError("Submission link is required");
    try {
      setLoading(true);
      await onSubmit({ taskId: task._id, submissionLink: link.trim() });
      onClose();
    } catch (err) {
      setError("You have already submitted this task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-black border border-white/10 p-12 shadow-2xl"
        >
          <div className="space-y-12">
              <header>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-6">/ TRANSMISSION INITIATED</span>
                 <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">{task.title}</h2>
                 <p className="text-zinc-500 text-xs font-inter uppercase tracking-widest mb-6">{task.points} XP MISSION OBJECTIVE</p>
                 <div className="bg-white/2 border border-white/5 p-6 mb-8">
                   <p className="text-[10px] text-zinc-400 uppercase leading-relaxed tracking-wide font-inter">
                     {task.description}
                   </p>
                 </div>
              </header>

             <div className="space-y-8">
                <div className="bg-white/5 p-8 border border-white/5 focus-within:border-premium-accent/30 transition-all">
                   <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] block mb-4">SUBMISSION SOURCE LINK</label>
                   <input 
                     type="url"
                     value={link}
                     onChange={(e) => setLink(e.target.value)}
                     className="w-full bg-transparent text-xl font-black text-white outline-none placeholder:text-zinc-900 tracking-tighter"
                     placeholder="HTTPS://GITHUB.COM/IDENTITY/REPO"
                   />
                </div>
                <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">VERIFY ALL ASSETS BEFORE TRANSMISSION. DEPLOYMENTS ARE FINAL.</p>
             </div>

             {error && (
               <div className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</div>
             )}

             <div className="flex gap-4">
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 p-6 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-premium-accent hover:text-white transition-all disabled:opacity-50"
                >
                  {loading ? "TRANSMITTING..." : "COMMIT SUBMISSION"}
                </button>
                <button 
                  onClick={onClose}
                  className="p-6 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all"
                >
                  ABORT
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}