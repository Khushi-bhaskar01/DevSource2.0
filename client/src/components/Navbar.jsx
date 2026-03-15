import { useAuth } from "../AuthContext";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Members", path: "/members" },
  { label: "Projects", path: "/projects" },
  { label: "Task", path: "/tasks" },
  { label: "Rankings", path: "/leaderboard" },
];

export default function Navbar() {
  const { user } = useAuth();
  const userId = user?._id || user?.id || null;
  const profilePath = userId ? `/profile` : "/login";
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 border-b ${
        scrolled 
          ? "bg-black/80 backdrop-blur-xl border-white/10 py-4" 
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <img src="/logo.png" alt="DevSource" className="w-8 h-8 object-contain transition-transform duration-500" />
            <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-white font-outfit font-black text-xl tracking-tighter uppercase">
            DevSource
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`relative font-inter text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                location.pathname === item.path
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              {location.pathname === item.path && (
                <motion.span 
                  layoutId="navUnderline"
                  className="absolute -bottom-2 left-0 w-full h-[1px] bg-premium-accent"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Profile */}
        <div className="hidden md:flex items-center gap-8">
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <Link
              to="/admin"
              className="text-[10px] font-black uppercase tracking-widest text-premium-accent hover:text-white transition-colors"
            >
              Override
            </Link>
          )}
          {user && (
            <Link
              to="/settings"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              Config
            </Link>
          )}
          <Link
            to={profilePath}
            className="flex items-center gap-3 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
              {user ? "Terminal" : "Access"}
            </span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all overflow-hidden bg-white/5">
              <User size={14} className="text-zinc-400 group-hover:text-white" />
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white flex flex-col gap-1.5 p-2"
        >
          <div className={`w-6 h-0.5 bg-white transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-4 h-0.5 bg-white transition-all ${isOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 px-6 py-12 flex flex-col items-center gap-8 md:hidden shadow-2xl"
          >
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-2xl font-outfit font-black uppercase tracking-tighter hover:text-premium-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={profilePath}
              className="mt-4 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full"
              onClick={() => setIsOpen(false)}
            >
              {user ? "View Terminal" : "Access Portal"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
