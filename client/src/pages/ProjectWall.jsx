import React, { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HARDCODED_PROJECTS = [
  {
    _id: "p1",
    title: "EcoTask Manager",
    members: ["Khushi Bhaskar", "Utkarsh Yadav", "Anurag Singh", "Krrish Khowal", "Aadi Jain", "Priya Sharma"],
    teamName: "DevSource",
    deployedLink: "https://example.com/ecotask",
    domain: "Web Development",
    description: "Sustainable task management reducing digital clutter and optimizing energy usage in remote teams.",
    points: 800,
    tags: ["React", "Node.js"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80",
  },
  {
    _id: "p2",
    title: "NeuroTrack App",
    members: ["Utkarsh Yadav", "Meera Joshi", "Rahul Gupta", "Sneha Patel", "Dev Malhotra", "Aryan Singh", "Tanya Verma"],
    teamName: "V0ID_SCAN",
    deployedLink: "https://example.com/neuro",
    domain: "App Development",
    description: "Cognitive health monitoring through AI-driven pattern recognition and real-time user feedback.",
    points: 1200,
    tags: ["Flutter", "TensorFlow"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80",
  },
  {
    _id: "p3",
    title: "Vertex Engine",
    members: ["Aadi Jain", "Rohan Mehta", "Isha Kapoor", "Vikram Das", "Nisha Rao", "Kabir Sen"],
    teamName: "RENDER_CORE",
    deployedLink: "https://example.com/vertex",
    domain: "Game Development",
    description: "High-performance physics engine for collaborative 3D environments and real-time interaction.",
    points: 1500,
    tags: ["C++", "Vulkan"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&q=80",
  },
  {
    _id: "p4",
    title: "Cryptyo Protocol",
    members: ["Krrish Khowal", "Ananya Roy", "Siddharth Nair", "Pooja Iyer", "Arjun Bhat", "Lakshmi Pillai", "Ronak Shah"],
    teamName: "HASH_SYNDICATE",
    deployedLink: "https://example.com/crypto",
    domain: "Web3 / Blockchain",
    description: "Secure decentralized identity protocol for managing credentials across multiple networks.",
    points: 950,
    tags: ["Solidity", "Web3.js"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=900&q=80",
  },
  {
    _id: "p5",
    title: "Flux Capacitor UI",
    members: ["Anurag Singh", "Divya Menon", "Harsh Agarwal", "Riya Desai", "Nikhil Kumar", "Shreya Tiwari"],
    teamName: "UI_ARCHITECTS",
    deployedLink: "https://example.com/flux",
    domain: "UI/UX Architecture",
    description: "Design system for high-scale enterprise applications focused on rapid prototyping and accessibility.",
    points: 600,
    tags: ["Figma", "React"],
    image: "https://images.unsplash.com/photo-1545670723-196ed0954986?w=900&q=80",
  },
  {
    _id: "p6",
    title: "BioSync Dashboard",
    members: ["Khushi Bhaskar", "Tanvi Choudhary", "Manav Sethi", "Preethi Nambiar", "Zubin Irani", "Aditi Ghosh", "Sameer Khan"],
    teamName: "BIO_HACKERS",
    deployedLink: "https://example.com/biosync",
    domain: "Health Tech",
    description: "Real-time biometric data analysis for professional athletes during high-intensity training sessions.",
    points: 1100,
    tags: ["D3.js", "Express"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80",
  },
];

const N = HARDCODED_PROJECTS.length;

export default function ProjectWall() {
  const outerRef = useRef(null);   // pinned wrapper
  const trackRef = useRef(null);   // horizontal strip
  const heroRef  = useRef(null);   // heading section

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const outer = outerRef.current;

      // Travel distance = full track width minus one viewport
      const travelDist = () => track.scrollWidth - window.innerWidth;

      // ── Hero entrance ──────────────────────────────────────────────────────
      gsap.from(".pw-hero-label", {
        opacity: 0, x: -20, duration: 0.8, ease: "power3.out", delay: 0.2,
      });
      gsap.from(".pw-hero-title", {
        opacity: 0, y: 60, duration: 1, ease: "power3.out", delay: 0.35,
      });
      gsap.from(".pw-hero-hint", {
        opacity: 0, y: 20, duration: 0.8, ease: "power3.out", delay: 0.65,
      });

      // ── GSAP horizontal scroll (the main effect) ───────────────────────────
      // Pin `outer`, tween `track` x from 0 → -travelDist()
      // scrub: 1.2 → silky smooth 1.2s lag behind scroll
      const hst = gsap.to(track, {
        x: () => -travelDist(),
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${travelDist()}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ── Image parallax ─────────────────────────────────────────────────────
      const imgs = track.querySelectorAll(".pw-img-bg");
      ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: () => `+=${travelDist()}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const travel = self.progress * travelDist();
          imgs.forEach((img, i) => {
            gsap.set(img, { x: (travel - i * window.innerWidth) * 0.12 });
          });
        },
      });

      // ── Per-card content reveal ────────────────────────────────────────────
      track.querySelectorAll(".pw-card-body").forEach((body, i) => {
        if (i === 0) return;
        gsap.from(body, {
          opacity: 0,
          x: 50,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            containerAnimation: hst,
            trigger: body.closest(".pw-card"),
            start: "left 85%",
            toggleActions: "play none none none",
          },
        });
      });

      ScrollTrigger.refresh();

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        body { background: #000 !important; }
        .pw-member:hover  { border-color: rgba(255,255,255,0.28) !important; color: rgba(255,255,255,0.7) !important; }
        .pw-link:hover    { color: #fff !important; }
      `}</style>

      <div style={{ background: "#000", color: "#fff", fontFamily: "var(--font-inter,sans-serif)" }}>
        <Navbar />

        {/* ── HERO ── */}
        <section
          ref={heroRef}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 clamp(24px,5vw,64px) clamp(48px,8vh,80px)",
            background: "#000",
            position: "relative",
          }}
        >
          {/* bottom border */}
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:"rgba(255,255,255,0.06)" }} />

          <p
            className="pw-hero-label"
            style={{
              fontSize: 10, fontWeight: 900,
              textTransform: "uppercase", letterSpacing: "0.42em",
              color: "rgba(255,255,255,0.22)", marginBottom: 24,
            }}
          >
            / REPOSITORY
          </p>

          <h1
            className="pw-hero-title"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(72px,16vw,180px)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 0.82,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            PROJECT{" "}
            <span style={{ color: "rgba(255,255,255,0.14)" }}>WALL</span>.
          </h1>

          <p
            className="pw-hero-hint"
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.36em",
              color: "rgba(255,255,255,0.17)",
              marginTop: 28,
              display: "flex", alignItems: "center", gap: 14,
            }}
          >
            <span style={{ display:"inline-block",width:32,height:1,background:"rgba(255,255,255,0.13)" }} />
            SCROLL DOWN TO EXPLORE ALL PROJECTS
          </p>
        </section>

        {/* ── PINNED HORIZONTAL SECTION ── */}
        <div
          ref={outerRef}
          style={{ overflow: "hidden", background: "#000" }}
        >
          {/* Track: N cards × 100vw wide */}
          <div
            ref={trackRef}
            style={{
              display: "flex",
              height: "100vh",
              width: `${N * 100}vw`,
              willChange: "transform",
            }}
          >
            {HARDCODED_PROJECTS.map((project, idx) => (
              <div
                key={project._id}
                className="pw-card"
                style={{
                  width: "100vw", height: "100%",
                  flexShrink: 0,
                  display: "flex", flexDirection: "row",
                  background: "#000",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  overflow: "hidden", position: "relative",
                }}
              >
                {/* Image */}
                <div style={{ position:"relative",width:"52%",height:"100%",flexShrink:0,overflow:"hidden" }}>
                  <div
                    className="pw-img-bg"
                    style={{
                      position: "absolute", inset: "-12%",
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: "cover", backgroundPosition: "center",
                      willChange: "transform",
                    }}
                  />
                  <div style={{
                    position:"absolute",inset:0,
                    background:
                      "linear-gradient(to right,rgba(0,0,0,0.02) 28%,rgba(0,0,0,0.92) 100%)," +
                      "linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,transparent 30%)",
                  }} />
                  <div style={{
                    position:"absolute",bottom:16,left:20,
                    fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:"clamp(80px,15vw,160px)",lineHeight:1,
                    color:"rgba(255,255,255,0.06)",userSelect:"none",pointerEvents:"none",
                  }}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}
                <div
                  className="pw-card-body"
                  style={{
                    flex: 1,
                    display: "flex", flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "clamp(28px,4vw,68px)",
                    overflowY: "auto",
                  }}
                >
                  <div>
                    <p style={{ fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.38em",color:"rgba(255,255,255,0.26)",marginBottom:4 }}>
                      {project.domain}
                    </p>
                    <p style={{ fontSize:9,textTransform:"uppercase",letterSpacing:"0.22em",color:"rgba(255,255,255,0.13)",marginBottom:16 }}>
                      {project.teamName}
                    </p>
                    <h2 style={{
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:"clamp(40px,5.5vw,80px)",
                      fontWeight:900,textTransform:"uppercase",lineHeight:0.88,
                      color:"#fff",marginBottom:16,
                    }}>
                      {project.title}
                    </h2>
                    <div style={{ width:"58%",height:1,background:"rgba(255,255,255,0.12)",marginBottom:16 }} />
                    <p style={{ fontSize:11,textTransform:"uppercase",letterSpacing:"0.07em",lineHeight:2,color:"rgba(255,255,255,0.25)",maxWidth:420,marginBottom:18 }}>
                      {project.description}
                    </p>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:24 }}>
                      {project.tags.map(tag => (
                        <span key={tag} style={{ fontSize:8,textTransform:"uppercase",letterSpacing:"0.18em",padding:"3px 9px",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.22)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Members */}
                    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                      <span style={{ fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(255,255,255,0.18)",whiteSpace:"nowrap" }}>
                        Contributors
                      </span>
                      <div style={{ flex:1,height:1,background:"rgba(255,255,255,0.06)" }} />
                      <span style={{ fontSize:9,color:"rgba(255,255,255,0.1)",whiteSpace:"nowrap" }}>
                        {project.members.length} members
                      </span>
                    </div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:20 }}>
                      {project.members.map(name => (
                        <span key={name} className="pw-member" style={{
                          fontSize:8,textTransform:"uppercase",letterSpacing:"0.13em",
                          padding:"4px 9px",border:"1px solid rgba(255,255,255,0.08)",
                          color:"rgba(255,255,255,0.3)",cursor:"default",transition:"all .22s",
                        }}>
                          {name}
                        </span>
                      ))}
                    </div>

                    {/* Bottom */}
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                      <span style={{ fontSize:9,textTransform:"uppercase",letterSpacing:"0.22em",color:"rgba(255,255,255,0.13)" }}>
                        {project.points} XP
                      </span>
                      <a
                        href={project.deployedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pw-link"
                        style={{ fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.26em",color:"rgba(255,255,255,0.28)",textDecoration:"none",transition:"color .22s" }}
                        onClick={e => e.stopPropagation()}
                      >
                        VIEW PROJECT →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}