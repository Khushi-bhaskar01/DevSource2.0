import React, { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HARDCODED_PROJECTS = [
  {
    _id: "p1",
    title: "DevSource Portfolio",
    members: ["Whole Devsource Team"],
    deployedLink: "https://dev-source-portfolio.vercel.app/",
    domain: "Web Development",
    description: "Showcase of the best projects, members and achievements of DevSource Syndicate, with dynamic content management and interactive UI/UX.",
    tags: ["GSAP", "Next.js"],
    image: "/portfolio.png",
  },
  {
    _id: "p2",
    title: "ICPC Website ",
    members: [ "Anurag Singh","Krrish Khowal", "Aadi Jain", "Utkarsh Yadav"],
    deployedLink: "https://www.icpcusict.dev/",
    domain: "Web Development",
    description: "Official Webiste of ICPC USICT ACM Student Chapter — Competitive Programming Portal with problem archives, live contest updates, member profiles and leaderboard features.",
    tags: ["Next.js", "Node.js"],
    image: "/icpc.png",
  },
  {
    _id: "p3",
    title: "LearnCSWithArshi",
    members: ["Khushi Bhaskar"],
    deployedLink: "https://learncswitharshi.com/",
    domain: "Web Development",
    description: "Educational platform video tutorial and notes resources for learning computer science concepts, with payment gateway integration for premium content.",
    tags: ["Next.js", "Firebase"],
    image: "/learn.png",
  },
  {
    _id: "p4",
    title: "Doggos of IPU",
    members: ["Nikhil Goyal", "Atharv Handa", "Himanshu Singh", "Jiya Aggarawal", "Vineet Tiwari", "Mohd. Sami"],
    deployedLink: "https://doggos-of-ipu.vercel.app/",
    domain: "Web Development",
    description: "Community-driven platform showcasing the beloved dogs of IPU campus, featuring photos, adoption , events and heartwarming stories contributed by students of IPU",
    tags: ["Next.js", "Supabase"],
    image: "/doggos.png",
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
      const hst = gsap.to(track, {
        x: () => -travelDist(),
        ease: "power1.out",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${travelDist() * 2}`,
          scrub: 1.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });


      // ── Per-card content reveal ────────────────────────────────────────────
      track.querySelectorAll(".pw-card-body").forEach((body, i) => {
        if (i === 0) return;
        gsap.from(body, {
          opacity: 0,
          x: 50,
          duration: 1.5,
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
        .pw-member:hover  { border-color: rgba(255,255,255,0.55) !important; color: #fff !important; }
        .pw-link:hover    { opacity: 1 !important; letter-spacing: 0.32em !important; }
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
          style={{ overflow: "hidden", background: "#000", isolation: "isolate" }}
        >
          <div
            ref={trackRef}
            style={{
              display: "flex",
              height: "100vh",
              width: `${N * 100}vw`,
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            {HARDCODED_PROJECTS.map((project, idx) => (
              <div
                key={project._id}
                className="pw-card"
                style={{
                  width: "100vw", height: "100%",
                  flexShrink: 0,
                  marginRight: "-1px",
                  display: "flex", flexDirection: "row",
                  background: "#000",
                  /* borderRight removed — 1px border flickers during scrub */
                  overflow: "hidden", position: "relative",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Image */}
                <div style={{ position:"relative",width:"52%",height:"100%",flexShrink:0,overflow:"hidden" }}>
                  <div
                    className="pw-img-bg"
                    style={{
                      position: "absolute",inset: 0,
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: "cover", backgroundPosition: "center",
                      filter: "grayscale(20%) brightness(0.85)",
                    }}
                  />
                  {/* Left-edge black bleed kills the seam blink between cards */}
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
                    {/* Domain & Team */}
                    <p style={{ fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.38em",color:"rgba(255,255,255,0.6)",marginBottom:4 }}>
                      {project.domain}
                    </p>

                    {/* Title */}
                    <h2 style={{
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:"clamp(40px,5.5vw,80px)",
                      fontWeight:900,textTransform:"uppercase",lineHeight:0.88,
                      color:"#fff",marginBottom:16,
                    }}>
                      {project.title}
                    </h2>

                    <div style={{ width:"58%",height:1,background:"rgba(255,255,255,0.18)",marginBottom:16 }} />

                    {/* Description — readable, not uppercase */}
                    <p style={{ fontSize:13,lineHeight:1.75,color:"rgba(255,255,255,0.65)",maxWidth:420,marginBottom:20 }}>
                      {project.description}
                    </p>

                    {/* Tags — more visible */}
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:24 }}>
                      {project.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize:9,textTransform:"uppercase",letterSpacing:"0.18em",
                          padding:"4px 12px",
                          border:"1px solid rgba(255,255,255,0.38)",
                          color:"rgba(255,255,255,0.75)",
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Contributors header */}
                    <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                      <span style={{ fontSize:9,fontWeight:900,textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(255,255,255,0.55)",whiteSpace:"nowrap" }}>
                        Contributors
                      </span>
                      <div style={{ flex:1,height:1,background:"rgba(255,255,255,0.15)" }} />
                      <span style={{ fontSize:9,color:"rgba(255,255,255,0.4)",whiteSpace:"nowrap" }}>
                        {project.members.length} members
                      </span>
                    </div>

                    {/* Member chips — clearly visible */}
                    <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:24 }}>
                      {project.members.map(name => (
                        <span key={name} className="pw-member" style={{
                          fontSize:9,textTransform:"uppercase",letterSpacing:"0.13em",
                          padding:"5px 12px",
                          border:"1px solid rgba(255,255,255,0.3)",
                          color:"rgba(255,255,255,0.72)",
                          cursor:"default",transition:"all .22s",
                        }}>
                          {name}
                        </span>
                      ))}
                    </div>

                    {/* Bottom — only the link, no XP */}
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"flex-end",paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.12)" }}>
                      <a
                        href={project.deployedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pw-link"
                        style={{
                          fontSize:11,fontWeight:900,textTransform:"uppercase",
                          letterSpacing:"0.26em",color:"#fff",
                          textDecoration:"none",
                          opacity:0.88,
                          transition:"opacity .22s, letter-spacing .22s",
                          display:"flex",alignItems:"center",gap:8,
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        VIEW PROJECT <span style={{ fontSize:15,lineHeight:1 }}>→</span>
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