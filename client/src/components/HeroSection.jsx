import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScribbleDoodle } from './Doodles';

export default function HeroSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Subtle parallax effect on scroll
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrolled = window.scrollY;
      gsap.to(containerRef.current.querySelector('.hero-blob'), {
        y: scrolled * 0.4,
        ease: 'none',
        duration: 0
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden border-b border-white/5 bg-[#050505]"
    >
      {/* Premium Accent Blob */}
      <div className="hero-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-premium-accent/10 rounded-full blur-[160px] opacity-40 pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Index Label */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8 overflow-hidden"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-premium-accent">001 — ARCHIVE</span>
            <div className="w-12 h-px bg-white/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 underline underline-offset-4 decoration-premium-accent/50">EST. 2024</span>
          </motion.div>

          {/* Main Title Section */}
          <div className="relative mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter uppercase text-white relative z-0"
            >
              BUILD <span className="text-zinc-600">THE</span><br />
              <span className="flex items-center gap-4 justify-center">
                FUTURE
                <div className="w-16 h-16 md:w-28 md:h-28 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                   <div className="w-3 h-3 bg-premium-accent rounded-full animate-ping" />
                </div>
              </span>
            </motion.h1>
          </div>

          {/* Subtitle / Content */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-2xl text-zinc-400 font-inter text-lg md:text-xl leading-relaxed mb-16 px-4"
          >
            DevSource is an elite syndicate for student architects. We don't just write code; we engineer legacies through high-impact, real-world deployment.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button 
              onClick={() => window.location.href = '/tasks'}
              className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full overflow-hidden transition-all hover:bg-premium-accent hover:text-white"
            >
              <span className="relative z-10 flex items-center gap-2">
                DEPLOY SYSTEM
                <motion.div
                   animate={{ x: [0, 5, 0] }}
                   transition={{ repeat: Infinity, duration: 1.5 }}
                >
                   →
                </motion.div>
              </span>
            </button>
            
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:bg-white/5 hover:border-white/30 transition-all flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 group-hover:bg-white" />
              RETRIEVE INFO
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-white/10" />
      <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-white/10" />
      <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-white/10" />
      <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-white/10" />
    </section>
  );
}