import React from "react";
import { motion } from "framer-motion";

export default function TaskCard({ task, submission, onOpenSubmit, index }) {
  const isSubmitted = !!submission;
  const status = submission?.status || "Open";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-[#0a0a0a] border border-white/5 p-8 transition-all duration-500 hover:border-premium-accent/30 ${isSubmitted ? 'opacity-60' : ''}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
             {task.domain?.toUpperCase()} // {task.points}XP
           </span>
           <div className={`w-2 h-2 rounded-full ${isSubmitted ? 'bg-zinc-800' : 'bg-premium-accent animate-pulse'}`} />
        </div>

        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4 group-hover:text-premium-accent transition-colors">
          {task.title}
        </h3>
        
        <p className="text-zinc-500 text-xs font-inter leading-relaxed mb-12 line-clamp-3">
          {task.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
           <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700">
             STATUS: {status.toUpperCase()}
           </div>
           
           {!isSubmitted ? (
             <button 
               onClick={onOpenSubmit}
               className="text-[10px] font-black uppercase tracking-[0.2em] text-white underline underline-offset-8 decoration-white/10 hover:text-premium-accent hover:decoration-premium-accent transition-all"
             >
               PUSH UPDATE →
             </button>
           ) : (
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-800">
               LOCKED
             </span>
           )}
        </div>
      </div>

      {/* Identity Stamp */}
      <div className="absolute -bottom-2 -right-2 text-[8px] font-black text-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
        TASK_ID_{task._id.slice(-6)}
      </div>
    </motion.div>
  );
}
