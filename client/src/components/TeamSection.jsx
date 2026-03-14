import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';  
const teamMembers = [
  {
    name: "Khushi Bhaskar",
    role: "Lead",
    id: "01",
    skills: ["MERN", "DOCKER", "AWS"],
    image: "/images/KB.jpg",
    github: "https://github.com/Khushi-bhaskar01",
    linkedin: "https://www.linkedin.com/in/khushi-bhaskar-b00586324/"
  },
  {
    name: "Krrish Khowal",
    role: "Vice Lead",
    id: "02",
    skills: ["KOTLIN", "ANDROID", "FIREBASE"],
    image: "/images/vice_lead.JPG",
    github: "https://github.com/Krrish-29",
    linkedin: "https://www.linkedin.com/in/krrish-khowal-150885311/"
  },
  {
    name: "Utkarsh Yadav",
    role: "Web Dev",
    id: "03",
    skills: ["REACT", "NODE.JS", "UI/UX"],
    image: "/images/utk.jpg",
    github: "https://github.com/utkarsh3078",
    linkedin: "https://www.linkedin.com/in/utkarsh-yadav3078a"
  },
  {
    name: "Anurag kr Singh",
    role: "App Dev",
    id: "04",
    skills: ["RE-NATIVE", "FLUTTER", "UI/UX"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnuragKumarSingh",
    github: "https://github.com/shinobi04",
    linkedin: "https://www.linkedin.com/in/anurag40/"
  },
  {
    name: "Aadi Jain",
    role: "Game Dev",
    id: "05",
    skills: ["GODOT", "UNITY", "C#"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aadi",
    github: "https://github.com/DarthRevan02",
    linkedin: "https://www.linkedin.com/in/darthaadixd/"
  }
];

export default function TeamSection() {
  return (
    <section
      id="team"
      className="relative min-h-screen bg-black text-white py-32 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px] block mb-6"
          >
            / PERSONNEL
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]"
          >
            THE CORE <span className="text-zinc-500">SQUAD</span>.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900 mb-8 border border-white/5 group-hover:border-premium-accent/30 transition-all duration-500">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                {/* ID Stamp */}
                <div className="absolute top-6 right-6 text-[10px] font-black tracking-widest text-white/50">
                  {member.id} // ARCHIVE
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-premium-accent transition-colors">
                  {member.name}
                </h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  {member.role}
                </p>

                <div className="flex gap-4">
                  <a href={member.github} target="_blank" className="text-[20px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    <FaGithub />
                  </a>
                  <a href={member.linkedin} target="_blank" className="text-[20px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}