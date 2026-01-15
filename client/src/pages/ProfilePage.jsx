import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { BADGES } from "../data/badgeConfig.js";
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
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { token, loading: authLoading, logout, user: authUser, setUser: setAuthUser } = useAuth();

  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
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

  // -----------------------------------------
  // FETCH USER PROFILE
  // -----------------------------------------
  useEffect(() => {
    let mounted = true;
    if (authLoading) return;

    const isPublicView = Boolean(paramId);
    let targetId = isPublicView ? paramId : authUser?._id || authUser?.id;

    if (!isPublicView && !token) {
      navigate("/login");
      return;
    }

    const fetchPublic = async (id) => {
      try {
        const res = await api.get(`/api/profile/${id}`);
        const u = res.data?.user || res.data;
        if (mounted) {
          setUser(u);
          setOriginalUser(u);
          setForm({
            aboutMe: u.aboutMe || "",
            location: u.location || "",
            branch: u.branch || "",
            year: u.year || "",
            linkedin: u.linkedin || "",
            github: u.github || "",
            domain: u.domain || [],
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const fetchPrivate = async (id) => {
      try {
        const res = await api.get(`/api/user/${id}`);
        const u = res.data?.user || res.data;
        if (mounted) {
          setUser(u);
          setOriginalUser(u);
          // Update AuthContext only if it differs to avoid re-fetch loops
          try {
            const currentId = authUser?._id || authUser?.id;
            if (!currentId || String(currentId) !== String(u._id || u.id)) {
              setAuthUser && setAuthUser(u);
            }
          } catch (e) {
            // defensive: if comparison fails, only set when authUser missing
            if (!authUser) setAuthUser && setAuthUser(u);
          }
          setForm({
            aboutMe: u.aboutMe || "",
            location: u.location || "",
            branch: u.branch || "",
            year: u.year || "",
            linkedin: u.linkedin || "",
            github: u.github || "",
            domain: u.domain || [],
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (isPublicView) {
      fetchPublic(paramId);
    } else {
      // private view: if we already have authUser id, fetch directly
      if (targetId) {
        fetchPrivate(targetId);
      } else if (token) {
        // try to retrieve current user id from /api/user/data
        try {
          api
            .get("/api/user/data")
            .then((r) => {
              const id = r.data?.userData?.id;
              if (id) {
                targetId = id;
                fetchPrivate(id);
              } else {
                setError("Unable to determine current user");
                setLoading(false);
              }
            })
            .catch((e) => {
              setError(e.response?.data?.message || "Failed to load profile");
              setLoading(false);
            });
        } catch (e) {
          setError("Failed to load profile");
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    return () => {
      mounted = false;
    };
  }, [paramId, token, authLoading, authUser, navigate]);

  // Debug logging to help diagnose why inputs might be disabled
  useEffect(() => {
    if (!loading) {
      // Avoid logging token value
      console.log("ProfilePage debug", {
        paramId,
        isPublicView: Boolean(paramId),
        authUserId: authUser?._id || authUser?.id,
        hasToken: Boolean(token),
        originalUser,
        form,
      });
    }
  }, [loading, paramId, authUser, token, originalUser, form]);

  // -----------------------------------------
  // HANDLE INPUT
  // -----------------------------------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleDomain = (value) => {
    setForm((prev) => ({
      ...prev,
      domain: prev.domain.includes(value)
        ? prev.domain.filter((d) => d !== value)
        : [...prev.domain, value],
    }));
  };

  // -----------------------------------------
  // SAVE CHANGES
  // -----------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Build payload of only changed fields (compare with originalUser)
    const payload = {};
    const allowed = [
      "aboutMe",
      "location",
      "branch",
      "year",
      "linkedin",
      "github",
      "domain",
    ];

    allowed.forEach((key) => {
      const newVal = form[key];
      const oldVal = originalUser ? originalUser[key] : undefined;

      // normalize strings
      if (typeof newVal === "string") {
        const trimmed = newVal.trim();
        const oldStr = typeof oldVal === "string" ? oldVal.trim() : oldVal || "";
        if (trimmed !== oldStr && trimmed !== "") payload[key] = trimmed;
      } else if (Array.isArray(newVal)) {
        // compare arrays (simple shallow compare)
        const oldArr = Array.isArray(oldVal) ? oldVal : [];
        const changed = newVal.length !== oldArr.length || newVal.some((v, i) => v !== oldArr[i]);
        if (changed && newVal.length > 0) payload[key] = newVal;
      } else if (newVal !== undefined && newVal !== null) {
        if (newVal !== oldVal) payload[key] = newVal;
      }
    });

    try {
      const targetId = paramId || authUser?._id || authUser?.id || originalUser?._id || originalUser?.id;
      if (!targetId) throw new Error("No target user id to update");

      const res = await api.put(`/api/user/${targetId}`, payload);
      const updated = res.data.user || res.data;
      setUser(updated);
      setOriginalUser(updated);
      // if the updated user is the authed user, update context (persisted)
      if (authUser && (authUser._id === updated._id || authUser.id === updated.id)) {
        setAuthUser && setAuthUser(updated);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------
  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
      // clear context & persisted token
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // -----------------------------------------
  // COPY PUBLIC PROFILE LINK
  // -----------------------------------------
  const publicProfileUrl = user && `${window.location.origin}/profile/${user._id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      setCopyLabel("Copied!");
      setTimeout(() => setCopyLabel("Copy Public Profile Link"), 1500);
    } catch {
      setCopyLabel("Failed!");
    }
  };

  // -----------------------------------------
  // UI LOADING + ERROR STATES
  // -----------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-[Zen_Dots]">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-[Zen_Dots]">{error || "User not found."}</p>
      </div>
    );
  }

  // -----------------------------------------
  // MAIN UI
  // -----------------------------------------
  const isPublicView = Boolean(paramId);
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-8">
      <Navbar />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 mt-10">

        {/* LEFT PROFILE CARD */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-linear-to-br from-pink-500 via-fuchsia-500 to-yellow-400 p-8 shadow-2xl text-center">

            <div className="w-28 h-28 rounded-full bg-black/20 flex items-center justify-center mb-4 overflow-hidden">
              {user.profilePicture ? (
                <img src={user.profilePicture} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{user.name?.[0]?.toUpperCase()}</span>
              )}
            </div>

            <h2 className="text-2xl font-[Zen_Dots]">{user.name}</h2>

            {user.location && (
              <p className="flex items-center justify-center gap-1 text-sm mt-1">
                <MapPin size={15} /> {user.location}
              </p>
            )}

            {user.branch && (
              <p className="flex items-center justify-center gap-1 text-sm">
                <GraduationCap size={15} />
                {user.branch} {user.year && `(${user.year})`}
              </p>
            )}

            {/* DOMAINS */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {user.domain?.map((d) => (
                <span
                  key={d}
                  className="px-3 py-1 bg-black/15 rounded-full text-xs font-[Zen_Dots]"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* SOCIAL */}
            <div className="mt-4 space-y-1">
              {user.linkedin && (
                <button
                  className="flex items-center gap-2 text-sm mx-auto"
                  onClick={() => window.open(user.linkedin, "_blank")}
                >
                  <Linkedin size={16} /> LinkedIn
                </button>
              )}

              {user.github && (
                <button
                  className="flex items-center gap-2 text-sm mx-auto"
                  onClick={() => window.open(user.github, "_blank")}
                >
                  <Github size={16} /> GitHub
                </button>
              )}
            </div>

            <button
              onClick={handleCopyLink}
              className="mt-6 flex items-center gap-2 text-sm border border-white/50 rounded-full px-4 py-2 mx-auto"
            >
              <Copy size={14} /> {copyLabel}
            </button>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="mt-6 flex items-center justify-center gap-2 bg-red-500 px-4 py-2 rounded-full text-sm font-[Zen_Dots] hover:bg-red-600 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full lg:w-2/3 space-y-8">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <form onSubmit={handleSave} className="space-y-8">
            {/* ABOUT SECTION */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-[Zen_Dots] text-lg">About Me</h3>
                <Edit3 size={16} className="text-white/60" />
              </div>

              <textarea
                name="aboutMe"
                value={form.aboutMe}
                onChange={handleChange}
                disabled={isPublicView}
                className="w-full min-h-[120px] bg-black border border-white/20 rounded-xl px-3 py-2 text-sm"
                placeholder="Write something about yourself..."
              />
            </section>

            {/* BASIC INFO + LINKS */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <h3 className="font-[Zen_Dots] text-lg mb-2">Basic Info</h3>

                <label className="text-xs">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  disabled={isPublicView}
                  className="w-full mb-3 bg-black border border-white/20 rounded-lg px-3 py-2"
                />

                <label className="text-xs">Branch</label>
                <input
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  disabled={isPublicView}
                  className="w-full mb-3 bg-black border border-white/20 rounded-lg px-3 py-2"
                />

                <label className="text-xs">Year</label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  disabled={isPublicView}
                  className="w-full bg-black border border-white/20 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <h3 className="font-[Zen_Dots] text-lg mb-2">Links & Domain</h3>

                <label className="text-xs">LinkedIn</label>
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  disabled={isPublicView}
                  className="w-full mb-3 bg-black border border-white/20 rounded-lg px-3 py-2"
                />

                <label className="text-xs">GitHub</label>
                <input
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  disabled={isPublicView}
                  className="w-full mb-3 bg-black border border-white/20 rounded-lg px-3 py-2"
                />

                <p className="text-xs mb-1">Domain(s)</p>
                <div className="flex flex-wrap gap-2">
                  {['web', 'app', 'game'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => !isPublicView && toggleDomain(d)}
                      disabled={isPublicView}
                      className={`px-3 py-1 rounded-full border text-xs font-[Zen_Dots] uppercase ${
                        form.domain.includes(d)
                          ? "bg-[#ff81cc] border-[#ff81cc] text-black"
                          : "border-white/30 text-white hover:border-[#ff81cc]"
                      }`}
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
                className="px-6 py-2 bg-[#ff81cc] rounded-full flex items-center gap-2 text-sm font-[Zen_Dots]"
              >
                {saving ? "Saving..." : "Save Changes"}
                {!saving && <CheckCircle size={16} />}
              </button>
            )}
          </form>

          {/* BADGES */}
          <section className="mt-6">
          <h3 className="font-[Zen_Dots] text-lg mb-3">My Badges</h3>

          <div className="flex flex-wrap gap-4">
          {BADGES.map((badge) => {
           const earned = Number(user?.points || 0) >= Number(badge.points);

          return (
            <div
              key={badge.id}
              className={`w-24 rounded-xl p-3 text-center border transition ${
                earned
                  ? "bg-white/10 border-white/30"
                  : "bg-black/40 border-white/10 opacity-40"
              }`}
            >
           <img
            src={badge.image}
            alt={badge.name}
            className={`w-14 h-14 mx-auto object-contain ${
              !earned ? "grayscale" : ""
             }`}
            />

               <p className="text-[11px] mt-2 font-[Zen_Dots]">
                 {badge.name}
               </p>

               {!earned ? (
                  <p className="text-[10px] text-gray-400">
                    Unlock at {badge.points} pts
                  </p>
                ) : (
                  <p className="text-[10px] text-green-400">Unlocked</p>
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
