import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ScribbleDoodle } from './Doodles';

export default function AboutSection() {
  const categories = [
    { id: "01", title: "WEB", detail: "ARCHITECTING HIGH-PERFORMANCE REACT INTERFACES" },
    { id: "02", title: "APP", detail: "ENGINEERING SCALABLE CROSS-PLATFORM SOLUTIONS" },
    { id: "03", title: "GAME", detail: "BUILDING IMMERSIVE VIRTUAL EXPERIENCES" },
    { id: "04", title: "CORE", detail: "OPEN SOURCE INNOVATION & LEGACY SYSTEMS" }
  ];

  return (
    <section 
      id="about"
      className="relative min-h-screen bg-black text-white py-32 px-6 overflow-hidden border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-premium-accent font-black uppercase tracking-[0.4em] text-[10px] block mb-6"
            >
              / PURPOSE
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] relative"
            >
              A SYNDICATE OF <span className="text-zinc-500">DIGITAL</span> ARCHITECTS.
              <div className="absolute -bottom-6 left-0 w-64 opacity-50">
                <ScribbleDoodle color="#ef5d47" />
              </div>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-zinc-500 font-inter text-sm max-w-xs leading-relaxed relative"
          >
            DevSource is a premier development collective under ACM USICT, GGSIPU. We bridge the gap between academic theory and high-stakes deployment.
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 mt-32 border-y border-white/10 relative">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black p-12 group hover:bg-zinc-900 transition-colors duration-500 relative overflow-hidden"
            >
              <span className="text-zinc-700 text-xs font-black mb-8 block">{cat.id} //</span>
              <h3 className="text-4xl font-black mb-4 group-hover:text-premium-accent transition-colors">{cat.title}</h3>
              <p className="text-zinc-500 text-[10px] font-black tracking-widest leading-loose">
                {cat.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Brand Text / Subtitles */}
        <div className="mt-32 flex flex-wrap justify-between items-center gap-12 opacity-50">
          {["ACM USICT", "GGSIPU", "INNOVATION", "DEPLOYMENT"].map((tag) => (
             <span key={tag} className="text-[10px] font-black uppercase tracking-[0.5em]">{tag}</span>
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-zinc-500/5 rounded-full blur-[120px] -z-10" />
    </section>
  );
}