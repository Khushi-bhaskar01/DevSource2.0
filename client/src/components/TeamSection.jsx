// components/TeamSection.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TeamSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });

      // Cards animation - smooth fade up
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });

      // Subtle parallax effect
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 1
            },
            y: i % 2 === 0 ? -10 : 10,
            ease: 'none'
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const teamMembers = [
    {
      name: "Khushi Bhaskar",
      role: "Lead Developer",
      username: "@khushi.dev",
      skills: ["MERN", "Docker", "AWS"],
      status: "online",
      image: "/images/KB.jpg",
      github: "https://github.com/Khushi-bhaskar01",
      linkedin: "https://www.linkedin.com/in/khushi-bhaskar-b00586324/"
    },
    {
      name: "Krrish Khowal",
      role: "Vice Lead",
      username: "@krrish.dev",
      skills: ["Kotlin", "Android", "Firebase"],
      status: "online",
      image: "/images/vice_lead.JPG",
      github: "https://github.com/Krrish-29",
      linkedin: "https://www.linkedin.com/in/krrish-khowal-150885311/"
    },
    {
      name: "Utkarsh Yadav",
      role: "Web Dev",
      username: "@utkarsh.dev",
      skills: ["React", "Node.js", "UI/UX"],
      status: "coding",
      image: "/images/utk.jpg",
      github: "https://github.com/utkarsh3078",
      linkedin: "https://www.linkedin.com/in/utkarsh-yadav3078a"
    },
    {
      name: "Anurag kr Singh",
      role: "App Dev",
      username: "@anurag.dev",
      skills: ["React Native", "Flutter", "UI/UX"],
      status: "online",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anurag",
      github: "https://github.com/shinobi04",
      linkedin: "https://www.linkedin.com/in/anurag40/"
    },
    {
      name: "Aadi Jain",
      role: "Game Dev",
      username: "@aadi.dev",
      skills: ["Godot", "Unity", "C#"],
      status: "online",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aadi",
      github: "https://github.com/DarthRevan02",
      linkedin: "https://www.linkedin.com/in/darthaadixd/"
    }
  ];

  return (
    <section 
      id="team"
      ref={sectionRef}
      className="relative py-24 bg-black text-white overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 0, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 0, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          className="w-full h-full"
        />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-600 rounded-full blur-[150px] opacity-20" />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-16">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-lg text-sm font-mono text-purple-300">
            {'> git log --team'}
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-mono">
          {'<'} MEET_THE_TEAM {'/>'} 
        </h2>
        <p className="text-gray-400 mt-4 font-mono text-sm">
          // Our squad of code ninjas 🥷
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto px-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            ref={el => cardsRef.current[index] = el}
            className="group relative w-80"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition-opacity duration-500" />
            
            {/* Card */}
            <div className="relative bg-gray-900 rounded-2xl border border-purple-500/30 overflow-hidden hover:border-purple-500 transition-all duration-300 hover:scale-[1.02]">
              {/* Terminal Header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono ml-2">{member.username}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'online' ? 'bg-green-400' : 
                    member.status === 'coding' ? 'bg-blue-400 animate-pulse' : 
                    'bg-gray-400'
                  }`} />
                  <span className="text-xs text-gray-400 font-mono">{member.status}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Avatar */}
                <div className="relative mb-4 mx-auto w-32 h-32">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                  <div className="relative w-full h-full bg-gray-800 rounded-2xl p-1 -rotate-3 group-hover:-rotate-6 transition-transform duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-xl object-cover"
                      onError={(e) => {
                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`;
                      }}
                    />
                  </div>
                  {/* Status badge */}
                  <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {member.role}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-400 text-sm font-mono">{member.username}</p>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 font-mono mb-2">// Tech stack:</div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, i) => (
                      <span 
                        key={i}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-mono border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-2">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-purple-600 rounded-lg transition-colors border border-gray-700 hover:border-purple-500"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-mono">GitHub</span>
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors border border-gray-700 hover:border-pink-500"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-xs font-mono">LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="h-1 bg-linear-to-r from-purple-500 via-pink-500 to-purple-500" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}