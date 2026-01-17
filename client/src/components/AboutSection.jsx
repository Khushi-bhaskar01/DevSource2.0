// components/AboutSection.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const headingRef = useRef(null);
  const terminalRef = useRef(null);

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

      // Cards animation
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      });

      // Hover rotation effect
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 1
            },
            y: i % 2 === 0 ? -20 : 20,
            ease: 'none'
          });
        }
      });

      // Terminal typing effect
      if (terminalRef.current) {
        const lines = terminalRef.current.querySelectorAll('.terminal-line');
        gsap.from(lines, {
          scrollTrigger: {
            trigger: terminalRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          opacity: 0,
          x: -20,
          duration: 0.5,
          stagger: 0.2
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const leaders = [
    {
      title: 'VICE LEAD',
      name: 'KRRISH KHOWAL',
      role: 'Full Stack Developer',
      linkedin: 'https://www.linkedin.com/in/krrish-khowal-150885311/',
      github: 'https://github.com/Krrish-29',
      gradient: 'from-purple-500 via-purple-600 to-pink-500',
      borderColor: 'border-purple-500'
    },
    {
      title: 'LEAD',
      name: 'KHUSHI BHASKAR',
      role: 'Tech Lead & Architect',
      linkedin: 'https://www.linkedin.com/in/khushi-bhaskar-b00586324/',
      github: 'https://github.com/Khushi-bhaskar01',
      gradient: 'from-pink-500 via-pink-600 to-purple-500',
      borderColor: 'border-pink-500'
    }
  ];

  return (
    <section 
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white py-20 px-6 overflow-hidden"
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
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-600 rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-pink-600 rounded-full blur-[120px] opacity-20" />

      {/* Heading with terminal style */}
      <div ref={headingRef} className="mb-20 text-center">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-lg text-sm font-mono text-purple-300">
            {'> about --info'}
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-mono">
          WHO WE ARE
        </h2>
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-16">
        {/* About Terminal Section */}
        <div 
          ref={terminalRef}
          className="bg-gray-900 rounded-lg border border-purple-500/30 shadow-2xl overflow-hidden max-w-4xl mx-auto"
        >
          <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-400 text-sm ml-4 font-mono">devsource.sh</span>
          </div>

          <div className="p-6 font-mono text-sm space-y-2">
            <div className="terminal-line flex items-start gap-2">
              <span className="text-green-400">$</span>
              <span className="text-purple-400">cat</span>
              <span className="text-blue-400">about.txt</span>
            </div>
            
            <div className="terminal-line text-gray-300 ml-4 leading-relaxed">
              DevSource is a development club under <span className="text-purple-400">ACM USICT, GGSIPU</span>,
            </div>
            <div className="terminal-line text-gray-300 ml-4 leading-relaxed">
              dedicated to fostering a community of passionate tech enthusiasts.
            </div>
            
            <div className="terminal-line mt-4 flex items-start gap-2">
              <span className="text-green-400">$</span>
              <span className="text-purple-400">echo</span>
              <span className="text-yellow-400">$FOCUS_AREAS</span>
            </div>
            
            <div className="terminal-line ml-4 flex items-center gap-2">
              <span className="text-pink-400">→</span>
              <span className="text-gray-300">Web Development</span>
            </div>
            <div className="terminal-line ml-4 flex items-center gap-2">
              <span className="text-pink-400">→</span>
              <span className="text-gray-300">App Development</span>
            </div>
            <div className="terminal-line ml-4 flex items-center gap-2">
              <span className="text-pink-400">→</span>
              <span className="text-gray-300">Game Development</span>
            </div>
            <div className="terminal-line ml-4 flex items-center gap-2">
              <span className="text-pink-400">→</span>
              <span className="text-gray-300">Open Source Contributions</span>
            </div>

            <div className="terminal-line mt-4 text-green-400">
              <span className="animate-pulse">▊</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}