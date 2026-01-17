import React, { useEffect, useState } from "react";
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
  const [copyLabel, setCopyLabel] = useState("Copy Public Profile Link");

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
      // Send the complete form data to the backend
      const res = await api.put(`/api/user/${user._id}`, form);
      const updated = res.data?.user || res.data;
      
      // Update all states with the fresh data from backend
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
      
      // CRITICAL: Update auth context to persist changes across navigation
      if (setAuthUser) {
        setAuthUser(updated);
      }
      
      // Clear any errors
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
      // Still logout on client side even if API fails
      logout();
      navigate("/login");
    }
  };

  const publicLink = user && `${window.location.origin}/profile/${user._id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Public Profile Link"), 1500);
    } catch {
      setCopyLabel("Failed!");
      setTimeout(() => setCopyLabel("Copy Public Profile Link"), 1500);
    }
  };

  // ---------------- UI STATES ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-[Zen_Dots]">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-[Zen_Dots]">
        {error || "User not found"}
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-8">
      <Navbar />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 mt-10">

        {/* LEFT CARD */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-linear-to-br from-pink-500 via-fuchsia-500 to-yellow-400 p-8 shadow-2xl text-center">

            <div className="w-28 h-28 rounded-full bg-black/20 mx-auto mb-4 overflow-hidden flex items-center justify-center">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{user.name?.[0]?.toUpperCase()}</span>
              )}
            </div>

            <h2 className="text-2xl font-[Zen_Dots]">{user.name}</h2>

            {user.location && (
              <p className="flex justify-center items-center gap-1 text-sm mt-1">
                <MapPin size={14} /> {user.location}
              </p>
            )}

            {user.branch && (
              <p className="flex justify-center items-center gap-1 text-sm">
                <GraduationCap size={14} />
                {user.branch} {user.year && `(${user.year})`}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {user.domain?.map((d) => (
                <span key={d} className="px-3 py-1 bg-black/20 rounded-full text-xs font-[Zen_Dots]">
                  {d}
                </span>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {user.linkedin && (
                <button 
                  onClick={() => window.open(user.linkedin, "_blank")} 
                  className="flex gap-2 mx-auto text-sm hover:underline"
                >
                  <Linkedin size={16} /> LinkedIn
                </button>
              )}
              {user.github && (
                <button 
                  onClick={() => window.open(user.github, "_blank")} 
                  className="flex gap-2 mx-auto text-sm hover:underline"
                >
                  <Github size={16} /> GitHub
                </button>
              )}
            </div>

            <button 
              onClick={copyLink} 
              className="mt-5 flex gap-2 mx-auto text-sm border border-white/50 px-4 py-2 rounded-full hover:bg-white/10 transition"
            >
              <Copy size={14} /> {copyLabel}
            </button>

            {!isPublicView && (
              <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 px-4 py-2 rounded-full text-sm font-[Zen_Dots] flex gap-2 mx-auto hover:bg-red-600 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-2/3 space-y-8">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <form onSubmit={handleSave} className="space-y-8">
            {/* ABOUT */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-[Zen_Dots] text-lg">About Me</h3>
                {!isPublicView && <Edit3 size={16} className="text-white/60" />}
              </div>
              <textarea
                name="aboutMe"
                value={form.aboutMe}
                disabled={isPublicView}
                onChange={handleChange}
                placeholder="Write something about yourself..."
                className="w-full min-h-[120px] bg-black border border-white/20 rounded-xl p-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </section>

            {/* BASIC INFO + LINKS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <h3 className="font-[Zen_Dots] text-lg mb-3">Basic Info</h3>

                <label className="text-xs text-white/70">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  disabled={isPublicView}
                  placeholder="City, Country"
                  className="w-full mb-3 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <label className="text-xs text-white/70">Branch</label>
                <input
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  disabled={isPublicView}
                  placeholder="e.g., Computer Science"
                  className="w-full mb-3 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <label className="text-xs text-white/70">Year</label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  disabled={isPublicView}
                  placeholder="e.g., 2024"
                  className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <h3 className="font-[Zen_Dots] text-lg mb-3">Links & Domain</h3>

                <label className="text-xs text-white/70">LinkedIn</label>
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  disabled={isPublicView}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full mb-3 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <label className="text-xs text-white/70">GitHub</label>
                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  disabled={isPublicView}
                  placeholder="https://github.com/..."
                  className="w-full mb-3 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                />

                <p className="text-xs text-white/70 mb-2">Domain(s)</p>
                <div className="flex flex-wrap gap-2">
                  {['web', 'app', 'game'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => !isPublicView && toggleDomain(d)}
                      disabled={isPublicView}
                      className={`px-3 py-1 rounded-full border text-xs font-[Zen_Dots] uppercase transition ${
                        form.domain.includes(d)
                          ? "bg-[#ff81cc] border-[#ff81cc] text-black"
                          : "border-white/30 text-white hover:border-[#ff81cc]"
                      } ${isPublicView ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {!isPublicView && (
              <button
                type="submit"
                disabled={saving}
                className="bg-[#ff81cc] px-6 py-2 rounded-full font-[Zen_Dots] flex gap-2 items-center hover:bg-[#ff6bb8] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
                {!saving && <CheckCircle size={16} />}
              </button>
            )}
          </form>

          {/* BADGES */}
          <section>
            <h3 className="font-[Zen_Dots] text-lg mb-3">My Badges</h3>
            <div className="flex flex-wrap gap-4">
              {BADGES.map((badge) => {
                const earned = Number(user.points || 0) >= Number(badge.points);
                return (
                  <div 
                    key={badge.id} 
                    className={`w-24 p-3 rounded-xl text-center border transition ${
                      earned 
                        ? "bg-white/10 border-white/30" 
                        : "bg-black/40 border-white/10 opacity-40"
                    }`}
                  >
                    <img 
                      src={badge.image} 
                      alt={badge.name}
                      className={`w-14 h-14 mx-auto object-contain ${!earned && "grayscale"}`} 
                    />
                    <p className="text-[11px] font-[Zen_Dots] mt-2">{badge.name}</p>
                    {earned ? (
                      <p className="text-[10px] text-green-400">Unlocked</p>
                    ) : (
                      <p className="text-[10px] text-gray-400">Unlock at {badge.points} pts</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}