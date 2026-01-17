import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosInstance";
import {
  Users,
  ClipboardList,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    // Check if user is admin
    if (!authUser?._id || authUser.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        setError("");

        // Fetch all data for stats
        const [usersRes, tasksRes, submissionsRes] = await Promise.all([
          api.get("/api/user/data").catch(() => ({ data: { members: {} } })),
          api.get("/api/tasks").catch(() => ({ data: [] })),
          api.get("/api/submissions").catch(() => ({ data: [] })),
        ]);

        // Handle users - the API returns grouped members
        let totalUsers = 0;
        if (usersRes.data?.members) {
          const { webDev = [], gameDev = [], appDev = [] } = usersRes.data.members;
          // Use Set to avoid counting users in multiple domains twice
          const uniqueUserIds = new Set();
          [...webDev, ...gameDev, ...appDev].forEach(user => {
            if (user._id) uniqueUserIds.add(user._id.toString());
          });
          totalUsers = uniqueUserIds.size;
        }

        const tasks = Array.isArray(tasksRes.data)
          ? tasksRes.data
          : tasksRes.data?.tasks || [];
        const submissions = Array.isArray(submissionsRes.data)
          ? submissionsRes.data
          : submissionsRes.data?.submissions || [];

        // Normalize submission status to lowercase for comparison
        const normalizeStatus = (status) => status?.toLowerCase() || "";

        setStats({
          totalUsers,
          totalTasks: tasks.length,
          totalSubmissions: submissions.length,
          pendingSubmissions: submissions.filter(
            (s) => normalizeStatus(s.status) === "pending"
          ).length,
          approvedSubmissions: submissions.filter(
            (s) => normalizeStatus(s.status) === "approved"
          ).length,
          rejectedSubmissions: submissions.filter(
            (s) => normalizeStatus(s.status) === "rejected"
          ).length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authUser, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <Navbar />
        <p className="text-center animate-pulse font-[Zen_Dots] mt-10">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-[Zen_Dots]">Admin Dashboard</h1>
            <p className="text-white/60 mt-1">
              Welcome back, {authUser?.name}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 px-4 py-3 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-linear-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="text-blue-400" size={40} />
            </div>
          </div>

          {/* Total Tasks */}
          <div className="bg-linear-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">
                  {stats.totalTasks}
                </p>
              </div>
              <ClipboardList className="text-purple-400" size={40} />
            </div>
          </div>

          {/* Total Submissions */}
          <div className="bg-linear-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm">Total Submissions</p>
                <p className="text-3xl font-bold text-pink-400 mt-1">
                  {stats.totalSubmissions}
                </p>
              </div>
              <TrendingUp className="text-pink-400" size={40} />
            </div>
          </div>

          {/* Pending Submissions */}
          <div className="bg-linear-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-400 mt-1">
                  {stats.pendingSubmissions}
                </p>
              </div>
              <Clock className="text-yellow-400" size={40} />
            </div>
          </div>

          {/* Approved Submissions */}
          <div className="bg-linear-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Approved</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  {stats.approvedSubmissions}
                </p>
              </div>
              <CheckCircle className="text-green-400" size={40} />
            </div>
          </div>

          {/* Rejected Submissions */}
          <div className="bg-linear-to-br from-red-500/20 to-red-600/20 border border-red-500/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-400 mt-1">
                  {stats.rejectedSubmissions}
                </p>
              </div>
              <Award className="text-red-400" size={40} />
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-[Zen_Dots] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/admin/tasks")}
              className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-[Zen_Dots] transition"
            >
              Manage Tasks
            </button>
            <button
              onClick={() => navigate("/admin/submissions")}
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg font-[Zen_Dots] transition"
            >
              Review Submissions
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-[Zen_Dots] transition"
            >
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}