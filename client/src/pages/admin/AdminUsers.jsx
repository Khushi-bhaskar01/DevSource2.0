import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosInstance";
import {
  Search,
  Award,
  Mail,
  MapPin,
  GraduationCap,
  Shield,
  User,
  TrendingUp,
  Linkedin,
} from "lucide-react";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDomain, setFilterDomain] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!authUser?._id || authUser.role !== "admin") {
      navigate("/");
      return;
    }

    fetchUsers();
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      filtered = filtered.filter((u) => u.role === filterRole);
    }

    if (filterDomain !== "all") {
      filtered = filtered.filter((u) => u.domain?.includes(filterDomain));
    }

    setFilteredUsers(filtered);
  }, [searchTerm, filterRole, filterDomain, users]);

  const fetchUsers = async () => {
    try {
      setError("");
      const res = await api.get("/api/user/data");
      
      // The API returns grouped members: { user, members: { webDev, gameDev, appDev } }
      let allUsers = [];
      
      if (res.data?.members) {
        const { webDev = [], gameDev = [], appDev = [] } = res.data.members;
        
        // Combine all users from different domains
        // Use a Map to handle users in multiple domains
        const userMap = new Map();
        
        [...webDev, ...gameDev, ...appDev].forEach(user => {
          if (user._id) {
            const userId = user._id.toString();
            if (!userMap.has(userId)) {
              userMap.set(userId, user);
            }
          }
        });
        
        allUsers = Array.from(userMap.values());
      }
      
      // Sort by points descending
      const sorted = allUsers.sort((a, b) => (b.points || 0) - (a.points || 0));
      
      setUsers(sorted);
      setFilteredUsers(sorted);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs font-[Zen_Dots] text-purple-400 flex items-center gap-1">
            <Shield size={12} /> Admin
          </span>
        );
      case "student":
        return (
          <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs font-[Zen_Dots] text-blue-400 flex items-center gap-1">
            <User size={12} /> Student
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 border border-gray-500/50 rounded-full text-xs font-[Zen_Dots] text-gray-400">
            {role}
          </span>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <Navbar />
        <p className="text-center animate-pulse font-[Zen_Dots] mt-10">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-[Zen_Dots]">Manage Users</h1>
            <p className="text-white/60 mt-1 text-sm">
              Total: {filteredUsers.length} users
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 px-4 py-3 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* FILTERS */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
          </select>
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm"
          >
            <option value="all">All Domains</option>
            <option value="web">Web</option>
            <option value="app">App</option>
            <option value="game">Game</option>
          </select>
        </div>

        {/* USERS GRID */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <p className="text-white/60 font-[Zen_Dots]">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition"
              >
                <div className="flex items-start gap-4">
                  {/* AVATAR */}
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-500 via-purple-500 to-yellow-400 flex items-center justify-center text-2xl font-bold shrink-0">
                    {user.name?.[0]?.toUpperCase() || "?"}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-[Zen_Dots] text-lg truncate">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getRoleBadge(user.role)}
                          {index < 3 && (
                            <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full text-xs font-[Zen_Dots] text-yellow-400">
                              Top {index + 1}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-400 font-bold text-lg whitespace-nowrap">
                        <Award size={20} />
                        {user.points || 0}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-white/70">
                      {user.email && (
                        <div className="flex items-center gap-2 truncate">
                          <Mail size={14} className="shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      )}

                      {user.branch && (
                        <div className="flex items-center gap-2">
                          <GraduationCap size={14} className="shrink-0" />
                          <span>
                            {user.branch}
                            {user.year && ` (${user.year})`}
                          </span>
                        </div>
                      )}

                      {user.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="shrink-0" />
                          <span>{user.location}</span>
                        </div>
                      )}

                      {user.linkedin && (
                        <div className="flex items-center gap-2">
                          <Linkedin size={14} className="shrink-0" />
                          <a
                            href={user.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 truncate"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}

                      {user.domain && user.domain.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.domain.map((d) => (
                            <span
                              key={d}
                              className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs uppercase"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/profile/${user._id}`)}
                      className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      View Profile
                      <TrendingUp size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}