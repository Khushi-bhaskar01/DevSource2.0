// components/HeroSection.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const codeRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      // Glitch effect on title
      tl.from(titleRef.current.children, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        stagger: 0.2
      })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
      }, '-=0.6')
      .from(ctaRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
      }, '-=0.5');

      // Typing animation for code block
      const codeLines = codeRef.current.querySelectorAll('.code-line');
      gsap.from(codeLines, {
        opacity: 0,
        x: -20,
        duration: 0.6,
        stagger: 0.15,
        delay: 1.5
      });

      // Parallax on scroll
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        opacity: 0.3,
        y: -100
      });

      // Grid animation
      gsap.to(gridRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        y: 100
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-20"
    >
      {/* Cyber Grid Background */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 0, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 0, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 5 + 3}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-white">
          <div ref={titleRef}>
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500 rounded-full text-sm font-mono text-purple-300">
                {'<DevSource />'}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="block bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Build. Ship.
              </span>
              <span className="block text-white items-center gap-4">
                Deploy 
                <span className="text-green-400 font-mono text-4xl animate-pulse">_</span>
              </span>
            </h1>
          </div>
          
          <p ref={subtitleRef} className="text-xl text-gray-300 mb-8 font-mono">
            {'>'} Empowering student developers to ship real-world projects
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.href = '/tasks'}
              className="group relative px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2 font-mono">
                git push origin main
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <button 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-purple-500 text-purple-300 font-bold rounded-lg hover:bg-purple-500/10 transition-all hover:scale-105 font-mono"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right Content - Code Editor */}
        <div 
          ref={codeRef}
          className="relative"
        >
          <div className="bg-gray-900 rounded-lg border border-purple-500/30 shadow-2xl overflow-hidden">
            {/* Editor Header */}
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-gray-400 text-sm ml-4 font-mono">app.jsx</span>
            </div>

            {/* Code Content */}
            <div className="p-6 font-mono text-sm overflow-hidden">
              <div className="code-line text-gray-500">
                <span className="text-purple-400">import</span>{' '}
                <span className="text-blue-400">React</span>{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-green-400">'react'</span>;
              </div>
              <div className="code-line text-gray-500 mt-2">
                <span className="text-purple-400">import</span>{' '}
                <span className="text-blue-400">{'{ DevSource }'}</span>{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-green-400">'@devsource/core'</span>;
              </div>
              
              <div className="code-line mt-4 text-gray-500">
                <span className="text-purple-400">function</span>{' '}
                <span className="text-yellow-400">App</span>
                <span className="text-gray-400">() {'{'}</span>
              </div>
              
              <div className="code-line ml-4 mt-2 text-gray-500">
                <span className="text-purple-400">return</span>{' '}
                <span className="text-gray-400">(</span>
              </div>
              
              <div className="code-line ml-8 mt-2">
                <span className="text-gray-500">{'<'}</span>
                <span className="text-pink-400">DevSource</span>
                <span className="text-gray-500">{'>'}</span>
              </div>
              
              <div className="code-line ml-12 mt-2">
                <span className="text-gray-500">{'<'}</span>
                <span className="text-blue-400">h1</span>
                <span className="text-gray-500">{'>'}</span>
                <span className="text-white">Ship Your Ideas</span>
                <span className="text-gray-500">{'</'}</span>
                <span className="text-blue-400">h1</span>
                <span className="text-gray-500">{'>'}</span>
              </div>
              
              <div className="code-line ml-12 mt-2">
                <span className="text-gray-500">{'<'}</span>
                <span className="text-blue-400">p</span>
                <span className="text-gray-500">{'>'}</span>
                <span className="text-gray-300">Build real projects</span>
                <span className="text-gray-500">{'</'}</span>
                <span className="text-blue-400">p</span>
                <span className="text-gray-500">{'>'}</span>
              </div>
              
              <div className="code-line ml-8 mt-2">
                <span className="text-gray-500">{'</'}</span>
                <span className="text-pink-400">DevSource</span>
                <span className="text-gray-500">{'>'}</span>
              </div>
              
              <div className="code-line ml-4 mt-2 text-gray-500">
                <span className="text-gray-400">);</span>
              </div>
              
              <div className="code-line mt-2 text-gray-500">
                <span className="text-gray-400">{'}'}</span>
              </div>

              <div className="code-line mt-4 text-gray-500">
                <span className="text-purple-400">export default</span>{' '}
                <span className="text-yellow-400">App</span>;
              </div>

              {/* Cursor */}
              <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-1" />
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 bg-purple-500/20 backdrop-blur-sm border border-purple-500 rounded-lg px-4 py-2 animate-bounce">
            <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Build Success
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 bg-pink-500/20 backdrop-blur-sm border border-pink-500 rounded-lg px-4 py-2" style={{ animation: 'bounce 2s infinite', animationDelay: '0.5s' }}>
            <div className="text-pink-400 text-sm font-mono">
              npm run deploy ✓
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
}