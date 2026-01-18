import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaLinkedin } from "react-icons/fa";
import Navbar from "../components/Navbar";

gsap.registerPlugin(ScrollTrigger);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const MemberCard = ({ name, linkedin, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.1,
        ease: "power2.out",
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="bg-linear-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl py-3 px-4 mb-3 flex justify-between items-center text-sm text-white/90 border border-purple-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
    >
      <span className="truncate font-medium">{name}</span>
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-400 hover:text-pink-300 transition-colors duration-200"
        >
          <FaLinkedin size={18} />
        </a>
      )}
    </div>
  );
};

const Members = () => {
  const [members, setMembers] = useState({
    webDev: [],
    gameDev: [],
    appDev: [],
  });

  const [loading, setLoading] = useState(true);
  const titleRef = useRef(null);
  const columnsRef = useRef([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/data`, {
          method: "GET",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();

        if (data.success && data.members) {
          setMembers({
            webDev: data.members.webDev || [],
            gameDev: data.members.gameDev || [],
            appDev: data.members.appDev || [],
          });
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: -50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        }
      );

      columnsRef.current.forEach((col, i) => {
        if (!col) return;

        gsap.fromTo(
          col,
          { opacity: 0, y: 100, rotateX: -15 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            delay: 0.3 + i * 0.2,
            ease: "power3.out",
          }
        );

        const glowDiv = col.querySelector(".glow-container");
        if (glowDiv) {
          gsap.to(glowDiv, {
            boxShadow:
              i === 0
                ? "0 0 40px rgba(168, 85, 247, 0.4)"
                : i === 1
                ? "0 0 40px rgba(236, 72, 153, 0.4)"
                : "0 0 40px rgba(6, 182, 212, 0.4)",
            duration: 2 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-black via-purple-950/20 to-black text-white flex items-center justify-center font-[Zen_Dots]">
        <div className="text-2xl bg-linear-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
          Loading members...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-purple-950/20 to-black text-white overflow-x-hidden relative">
      <Navbar />

      <div className="relative z-10">
        <h1
          ref={titleRef}
          className="text-center font-[monospace] text-6xl md:text-7xl mt-24 tracking-wider font-bold bg-linear-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"
        >
          MEMBERS
        </h1>

        <div className="flex justify-center gap-8 mt-20 px-8 flex-wrap pb-20">
          {[
            { key: "gameDev", label: "🎮 Game Dev", color: "yellow" },
            { key: "webDev", label: "💻 Web Dev", color: "pink" },
            { key: "appDev", label: "📱 App Dev", color: "cyan" },
          ].map((section, i) => (
            <div
              key={section.key}
              ref={(el) => (columnsRef.current[i] = el)}
              className="flex flex-col items-center"
            >
              <div className="glow-container w-72 h-[480px] rounded-3xl overflow-y-auto p-5">
                {members[section.key].length ? (
                  members[section.key].map((m, idx) => (
                    <MemberCard
                      key={m._id}
                      name={m.name}
                      linkedin={m.linkedin}
                      index={idx}
                    />
                  ))
                ) : (
                  <p className="text-white/40 text-sm text-center mt-8">
                    No members yet
                  </p>
                )}
              </div>
              <div className="mt-6 text-xl font-[Zen_Dots]">
                {section.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;
