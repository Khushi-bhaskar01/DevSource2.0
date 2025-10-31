import React from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="DevSource Logo" className="w-8 h-8" />
          <h1 className="font-[Zen_Dots] text-lg bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            DevSource
          </h1>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base">
          <li><a href="#home" className="hover:text-pink-400 transition">Home</a></li>
          <li><a href="#about" className="hover:text-pink-400 transition">Members</a></li>
          <li><a href="#projects" className="hover:text-pink-400 transition">Project Wall</a></li>
          <li><a href="#team" className="hover:text-pink-400 transition">Task</a></li>
          <li><a href="#contact" className="hover:text-pink-400 transition">Leaderboard</a></li>
        </ul>

        <div className="flex gap-5 text-xl">
          <a href="https://github.com/devsource" target="_blank" rel="noreferrer" className="hover:text-purple-400"><FaGithub /></a>
          <a href="https://www.linkedin.com/company/devsource" target="_blank" rel="noreferrer" className="hover:text-purple-400"><FaLinkedin /></a>
          <a href="https://www.instagram.com/devsource" target="_blank" rel="noreferrer" className="hover:text-pink-400"><FaInstagram /></a>
          <a href="mailto:devsourceclub@gmail.com" className="hover:text-pink-400"><FaEnvelope /></a>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} DevSource - Built with ❤️ by the DevSource Team
      </div>
    </footer>
  );
}
