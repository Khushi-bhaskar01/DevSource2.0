import React from 'react';
import { motion } from 'framer-motion';
import { ScribbleDoodle, CircleDoodle } from './Doodles';
import { FaGithub, FaLinkedin, FaInstagram, FaDiscord } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const footerNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Members', path: '/members' },
  { label: 'Projects', path: '/projects' },
  { label: 'Task', path: '/tasks' },
  { label: 'Rankings', path: '/leaderboard' },
];

const Footer = () => {
  return (
    <footer className="bg-black text-white py-24 px-6 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Scribbles */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 opacity-10 pointer-events-none">
        <ScribbleDoodle color="#ef5d47" />
      </div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
        <CircleDoodle className="animate-spin-slow" color="#ef5d47" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-black uppercase tracking-tighter mb-12"
        >
          DEV<span className="text-zinc-600 transition-colors hover:text-white">SOURCE</span>.
        </motion.h2>

        {/* Social Bridge */}
        <div className="flex gap-10 mb-16">
          {[FaGithub, FaLinkedin, FaInstagram, FaDiscord].map((Icon, i) => (
            <motion.a
              key={i}
              whileHover={{ y: -4, color: '#ef5d47' }}
              href="#"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Icon size={22} />
            </motion.a>
          ))}
        </div>

        {/* Navigation Grid */}
        <nav className="flex flex-wrap justify-center gap-x-16 gap-y-6 mb-20 z-20 relative">
          {footerNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 hover:text-white transition-colors relative group block p-2 md:p-0"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 w-0 h-px bg-premium-accent group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Custom Credits & Copyright */}
        <div className="w-full max-w-2xl pt-16 border-t border-white/5 space-y-8 flex flex-col items-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[1em]">© {new Date().getFullYear()} DEVSOURCE_SYNDICATE.v2</span>
            <div className="flex gap-4 opacity-30">
              <div className="w-1.5 h-1.5 rounded-full bg-premium-accent" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-premium-accent" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;