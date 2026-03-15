import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InitialLoader({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 0: Boot sequence (0s - 1.5s)
    // Phase 1: Cinematic Studio Title (1.5s - 5.5s)
    // Phase 2: Exit (Curtains opening) (5.5s - 7.0s)
    const t1 = setTimeout(() => setPhase(1), 1500);
    const t2 = setTimeout(() => setPhase(2), 5500);
    const t3 = setTimeout(() => onComplete(), 7000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-transparent text-white selection:bg-premium-accent/30 tracking-widest uppercase font-inter overflow-hidden"
      >
        {/* Film grain effect */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat z-30 mix-blend-overlay" />
        
        {/* Cinematic Letterbox Bars (Top & Bottom) that slide away on exit */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[51%] bg-[#030303] z-0"
          initial={{ y: "0%" }}
          animate={{ y: phase === 2 ? "-100%" : "0%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} 
        />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[51%] bg-[#030303] z-0"
          initial={{ y: "0%" }}
          animate={{ y: phase === 2 ? "100%" : "0%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} 
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div
                 key="phase-0"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                 transition={{ duration: 0.8 }}
                 className="flex flex-col items-center gap-8"
              >
                <div className="w-16 h-16 border-[1px] border-white/10 border-t-white/80 rounded-full animate-spin" />
                <span className="text-[10px] text-zinc-500 tracking-[0.8em] font-black pl-3 drop-shadow-2xl">ESTABLISHING_FEED</span>
              </motion.div>
            )}

            {phase === 1 && (
               <motion.div
                 key="phase-1"
                 initial={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, scale: 1.5, filter: "blur(15px)" }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="flex flex-col items-center"
               >
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-[9px] md:text-[11px] text-zinc-400 tracking-[1.5em] mb-6 pl-6 text-center"
                  >
                    WELCOME TO THE
                  </motion.span>
                  <div className="overflow-hidden px-4 flex flex-col items-center">
                    <motion.img 
                      src="/logo.png" 
                      alt="DevSource Logo" 
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ delay: 0.2, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                      className="w-24 md:w-32 object-contain mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    />
                    <motion.h1 
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ delay: 0.4, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                      className="text-6xl md:text-9xl font-black tracking-tighter leading-none"
                    >
                      DEV<span className="text-zinc-600">SOURCE</span>
                    </motion.h1>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.95)_100%)] pointer-events-none z-20" />
      </motion.div>
    </AnimatePresence>
  );
}
