import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import { BADGES } from "../data/badgeConfig";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../AuthContext";
import {
  MapPin,
  GraduationCap,
  Linkedin,
  Github,
  Copy,
  Edit3,
  CheckCircle,
  LogOut,
  Award,
  Code2,
  User,
  Link as LinkIcon,
} from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading, logout, setUser: setAuthUser } = useAuth();

  const isPublicView = Boolean(id);

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    aboutMe: "",
    location: "",
    branch: "",
    year: "",
    linkedin: "",
    github: "",
    domain: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy Link");

  const leftCardRef = useRef(null);
  const rightSectionRef = useRef(null);
  const badgesRef = useRef(null);

  // Animations
  useEffect(() => {
    if (!loading && user) {
      gsap.fromTo(
        leftCardRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        rightSectionRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );

      if (badgesRef.current) {
        gsap.fromTo(
          badgesRef.current.children,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.4)",
            delay: 0.4,
          }
        );
      }
    }
  }, [loading, user]);

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    if (authLoading) return;

    const fetchProfile = async () => {
      try {
        let targetId;

        // 🔐 PRIVATE PROFILE
        if (!isPublicView) {
          if (!authUser?._id) {
            navigate("/login");
            return;
          }
          targetId = authUser._id;
        } 
        // 🌍 PUBLIC PROFILE
        else {
          targetId = id;
        }

        const res = await api.get(`/api/user/${targetId}`);
        const u = res.data?.user || res.data;

        setUser(u);
        setForm({
          aboutMe: u.aboutMe || "",
          location: u.location || "",
          branch: u.branch || "",
          year: u.year || "",
          linkedin: u.linkedin || "",
          github: u.github || "",
          domain: u.domain || [],
        });

        // CRITICAL: Update auth context for private view to persist data
        if (!isPublicView && setAuthUser) {
          setAuthUser(u);
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
        setError(err.response?.data?.message || "Failed to load profile");
        if (!isPublicView) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, isPublicView, authLoading, authUser?._id, navigate, setAuthUser]);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleDomain = (d) => {
    setForm((prev) => ({
      ...prev,
      domain: prev.domain.includes(d)
        ? prev.domain.filter((x) => x !== d)
        : [...prev.domain, d],
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await api.put(`/api/user/${user._id}`, form);
      const updated = res.data?.user || res.data;
      
      setUser(updated);
      setForm({
        aboutMe: updated.aboutMe || "",
        location: updated.location || "",
        branch: updated.branch || "",
        year: updated.year || "",
        linkedin: updated.linkedin || "",
        github: updated.github || "",
        domain: updated.domain || [],
      });
      
      if (setAuthUser) {
        setAuthUser(updated);
      }
      
      setError("");
    } catch (err) {
      console.error("Save failed", err);
      setError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      logout();
      navigate("/login");
    }
  };

  const publicLink = user && `${window.location.origin}/profile/${user._id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Link"), 1500);
    } catch {
      setCopyLabel("Failed!");
      setTimeout(() => setCopyLabel("Copy Link"), 1500);
    }
  };

  // ---------------- UI STATES ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-700 rounded-lg">
          <svg className="animate-spin h-5 w-5 text-purple-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="font-mono text-sm text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-zinc-900 border-2 border-zinc-700 px-8 py-6 rounded-xl">
          <p className="font-mono text-gray-300">{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  // Calculate unlocked badges
  const unlockedCount = BADGES.filter(b => Number(user.points || 0) >= Number(b.points)).length;

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-8">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">
            {isPublicView ? "/ public-profile" : "/ profile"}
          </h1>
          <p className="text-gray-500 font-mono text-sm">
            {isPublicView ? `Viewing ${user.name}'s profile` : "Manage your developer profile"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT CARD */}
          <div ref={leftCardRef} className="w-full lg:w-80 shrink-0">
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-6 sticky top-28">
              
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-600 to-pink-600 mx-auto mb-4 overflow-hidden flex items-center justify-center border-4 border-zinc-800">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold">{user.name?.[0]?.toUpperCase()}</span>
                )}
              </div>

              {/* Name & Stats */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold font-mono mb-1">{user.name}</h2>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mt-3">
                  <div className="text-center">
                    <p className="text-xl font-bold font-mono text-purple-400">{user.points || 0}</p>
                    <p className="text-xs">Points</p>
                  </div>
                  <div className="w-px h-8 bg-zinc-700"></div>
                  <div className="text-center">
                    <p className="text-xl font-bold font-mono text-purple-400">{unlockedCount}/{BADGES.length}</p>
                    <p className="text-xs">Badges</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-6">
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin size={16} className="text-gray-500" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.branch && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <GraduationCap size={16} className="text-gray-500" />
                    <span>{user.branch} {user.year && `• ${user.year}`}</span>
                  </div>
                )}

                {user.domain && user.domain.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Code2 size={16} className="text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {user.domain.map((d) => (
                        <span key={d} className="px-2 py-0.5 bg-purple-600/20 text-purple-300 rounded text-xs font-mono border border-purple-500/30">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-zinc-800 mb-6"></div>

              {/* Links */}
              <div className="space-y-2 mb-6">
                {user.linkedin && (
                  <button 
                    onClick={() => window.open(user.linkedin, "_blank")} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
                  >
                    <Linkedin size={16} className="text-blue-400" />
                    <span>LinkedIn</span>
                  </button>
                )}
                {user.github && (
                  <button 
                    onClick={() => window.open(user.github, "_blank")} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
                  >
                    <Github size={16} className="text-gray-400" />
                    <span>GitHub</span>
                  </button>
                )}
              </div>

              {/* Copy Link */}
              <button 
                onClick={copyLink} 
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 rounded-lg text-sm transition-colors mb-3"
              >
                <Copy size={14} /> 
                <span className="font-mono">{copyLabel}</span>
              </button>

              {/* Logout */}
              {!isPublicView && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 rounded-lg text-sm text-red-400 transition-colors"
                >
                  <LogOut size={16} /> 
                  <span className="font-mono">Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div ref={rightSectionRef} className="flex-1 space-y-6">
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/40 px-5 py-4 rounded-xl">
                <p className="text-red-400 font-mono text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* ABOUT ME */}
              <section className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-purple-500" />
                    <h3 className="font-mono font-bold text-lg">About Me</h3>
                  </div>
                  {!isPublicView && <Edit3 size={16} className="text-gray-500" />}
                </div>
                <textarea
                  name="aboutMe"
                  value={form.aboutMe}
                  disabled={isPublicView}
                  onChange={handleChange}
                  placeholder="Tell the world about yourself..."
                  className="w-full min-h-[140px] bg-black border-2 border-zinc-700 rounded-lg p-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:border-purple-500/60 transition-colors font-mono resize-none"
                />
              </section>

              {/* BASIC INFO */}
              <section className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap size={18} className="text-purple-500" />
                  <h3 className="font-mono font-bold text-lg">Basic Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-mono mb-1 block">LOCATION</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      disabled={isPublicView}
                      placeholder="City, Country"
                      className="w-full bg-black border-2 border-zinc-700 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:border-purple-500/60 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-mono mb-1 block">BRANCH</label>
                    <input
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                      disabled={isPublicView}
                      placeholder="Computer Science"
                      className="w-full bg-black border-2 border-zinc-700 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:border-purple-500/60 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-mono mb-1 block">YEAR</label>
                    <input
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      disabled={isPublicView}
                      placeholder="2024"
                      className="w-full bg-black border-2 border-zinc-700 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:border-purple-500/60 transition-colors font-mono"
                    />
                  </div>
                </div>
              </section>

              {/* LINKS & DOMAIN */}
              <section className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon size={18} className="text-purple-500" />
                  <h3 className="font-mono font-bold text-lg">Links & Domain</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 font-mono mb-1 block">LINKEDIN</label>
                    <input
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handleChange}
                      disabled={isPublicView}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full bg-black border-2 border-zinc-700 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:border-purple-500/60 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-mono mb-1 block">GITHUB</label>
                    <input
                      name="github"
                      value={form.github}
                      onChange={handleChange}
                      disabled={isPublicView}
                      placeholder="https://github.com/username"
                      className="w-full bg-black border-2 border-zinc-700 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed focus:border-purple-500/60 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-mono mb-2 block">DOMAIN</label>
                    <div className="flex flex-wrap gap-2">
                      {['web', 'app', 'game'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => !isPublicView && toggleDomain(d)}
                          disabled={isPublicView}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-mono uppercase transition ${
                            form.domain.includes(d)
                              ? "bg-purple-600 border-purple-500 text-white"
                              : "bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600"
                          } ${isPublicView ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {!isPublicView && (
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-mono font-bold flex gap-2 items-center transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              )}
            </form>

            {/* BADGES */}
            <section className="bg-zinc-900 border-2 border-zinc-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award size={18} className="text-purple-500" />
                <h3 className="font-mono font-bold text-lg">Achievement Badges</h3>
                <span className="ml-auto text-sm font-mono text-gray-500">
                  {unlockedCount} / {BADGES.length}
                </span>
              </div>
              
              <div ref={badgesRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                {BADGES.map((badge) => {
                  const earned = Number(user.points || 0) >= Number(badge.points);
                  return (
                    <div 
                      key={badge.id} 
                      className={`group relative aspect-square rounded-xl border-2 transition-all ${
                        earned 
                          ? "bg-zinc-800 border-purple-500/40 hover:border-purple-500/60 hover:scale-105" 
                          : "bg-black/40 border-zinc-800 opacity-40"
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        <img 
                          src={badge.image} 
                          alt={badge.name}
                          className={`w-12 h-12 object-contain ${!earned && "grayscale"}`} 
                        />
                        <p className="text-[10px] font-mono text-center mt-1 leading-tight">{badge.name}</p>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        {earned ? "Unlocked!" : `${badge.points} pts required`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}