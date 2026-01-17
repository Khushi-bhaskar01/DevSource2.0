import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectWall() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.from(headingRef.current, {
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
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // PROJECT DATA - Edit this array to add/modify projects
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform with payment integration, cart functionality, and admin dashboard.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      githubUrl: "https://github.com/devsource/ecommerce",
      liveUrl: "https://ecommerce-demo.vercel.app",
      author: "Khushi Bhaskar",
      date: "Jan 2025"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Real-time collaborative task management tool with drag-and-drop functionality and team features.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
      tags: ["React", "Firebase", "Tailwind"],
      githubUrl: "https://github.com/devsource/taskmanager",
      liveUrl: "https://taskmanager-demo.vercel.app",
      author: "Krrish Khowal",
      date: "Dec 2024"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Beautiful weather app with real-time data, forecasts, and interactive maps showing global weather patterns.",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop",
      tags: ["React", "OpenWeather API", "Chart.js"],
      githubUrl: "https://github.com/devsource/weather",
      liveUrl: "https://weather-demo.vercel.app",
      author: "Utkarsh Yadav",
      date: "Nov 2024"
    },
    {
      id: 4,
      title: "Fitness Tracker",
      description: "Mobile-first fitness tracking application with workout plans, calorie counter, and progress analytics.",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
      tags: ["React Native", "Redux", "Firebase"],
      githubUrl: "https://github.com/devsource/fitness",
      liveUrl: "https://fitness-demo.vercel.app",
      author: "Anurag kr Singh",
      date: "Oct 2024"
    },
    {
      id: 5,
      title: "Portfolio Builder",
      description: "Easy-to-use portfolio builder with customizable templates, drag-and-drop editor, and one-click deployment.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      tags: ["Next.js", "Tailwind", "Vercel"],
      githubUrl: "https://github.com/devsource/portfolio-builder",
      liveUrl: "https://portfolio-builder-demo.vercel.app",
      author: "Aadi Jain",
      date: "Sep 2024"
    },
    {
      id: 6,
      title: "Chat Application",
      description: "Real-time chat app with end-to-end encryption, group chats, file sharing, and video calling features.",
      image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&h=600&fit=crop",
      tags: ["Socket.io", "WebRTC", "Express", "MongoDB"],
      githubUrl: "https://github.com/devsource/chat-app",
      liveUrl: "https://chat-demo.vercel.app",
      author: "DevSource Team",
      date: "Aug 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
        <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-pink-600 rounded-full blur-[150px] opacity-20" />

        <div ref={headingRef} className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-lg text-sm font-mono text-purple-300">
              {'> ls projects/'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-mono">
            PROJECT WALL
          </h1>
          <p className="text-gray-400 text-lg font-mono max-w-2xl mx-auto">
            // Showcasing our team's innovation and creativity
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section ref={sectionRef} className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={el => cardsRef.current[index] = el}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-gray-900 rounded-2xl border border-purple-500/30 overflow-hidden hover:border-purple-500 transition-all duration-300 h-full flex flex-col">
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-800">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-mono border border-purple-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs text-gray-500 font-mono mb-4">
                        <span>By {project.author}</span>
                        <span>{project.date}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-purple-600 rounded-lg transition-colors border border-gray-700 hover:border-purple-500"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-mono">Code</span>
                        </a>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="text-xs font-mono">Live</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-1 bg-linear-to-r from-purple-500 via-pink-500 to-purple-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}