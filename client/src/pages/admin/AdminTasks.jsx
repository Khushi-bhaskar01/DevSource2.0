import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../AuthContext";
import api from "../../api/axiosInstance";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Calendar,
  Award,
  Tag,
} from "lucide-react";

export default function AdminTasks() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    domain: "web",
    title: "",
    description: "",
    points: "",
    deadline: "",
  });

  useEffect(() => {
    if (authLoading) return;

    if (!authUser?._id || authUser.role !== "admin") {
      navigate("/");
      return;
    }

    fetchTasks();
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDomain !== "all") {
      filtered = filtered.filter((t) => t.domain === filterDomain);
    }

    setFilteredTasks(filtered);
  }, [searchTerm, filterDomain, tasks]);

  const fetchTasks = async () => {
    try {
      setError("");
      const res = await api.get("/api/tasks");
      const tasksData = Array.isArray(res.data) ? res.data : res.data?.tasks || [];
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Prepare payload - remove taskId field to let backend auto-generate
      const payload = {
        domain: form.domain,
        title: form.title.trim(),
        description: form.description.trim(),
        points: Number(form.points),
      };

      // Only add deadline if provided
      if (form.deadline) {
        payload.deadline = form.deadline;
      }

      if (editingTask) {
        // Update existing task
        await api.put(`/api/tasks/${editingTask._id}`, payload);
      } else {
        // Create new task - backend will auto-generate _id
        await api.post("/api/tasks", payload);
      }

      // Close modal and reset form
      setShowModal(false);
      setEditingTask(null);
      setForm({
        domain: "web",
        title: "",
        description: "",
        points: "",
        deadline: "",
      });
      
      // Refresh tasks list
      await fetchTasks();
    } catch (err) {
      console.error("Failed to save task:", err);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.error ||
                       "Failed to save task";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setForm({
      domain: task.domain || "web",
      title: task.title || "",
      description: task.description || "",
      points: task.points || "",
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
    });
    setShowModal(true);
    setError(""); // Clear any previous errors
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setError("");
      await api.delete(`/api/tasks/${taskId}`);
      await fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setForm({
      domain: "web",
      title: "",
      description: "",
      points: "",
      deadline: "",
    });
    setShowModal(true);
    setError(""); // Clear any previous errors
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setError("");
    setForm({
      domain: "web",
      title: "",
      description: "",
      points: "",
      deadline: "",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <Navbar />
        <p className="text-center animate-pulse font-[Zen_Dots] mt-10">
          Loading tasks...
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
          <h1 className="text-3xl font-[Zen_Dots]">Manage Tasks</h1>
          <button
            onClick={openCreateModal}
            className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-[Zen_Dots] flex items-center gap-2 transition"
          >
            <Plus size={20} /> Create Task
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 px-4 py-3 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              size={20}
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm"
            />
          </div>
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

        {/* TASKS TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left px-6 py-4 font-[Zen_Dots] text-sm">
                    Title
                  </th>
                  <th className="text-left px-6 py-4 font-[Zen_Dots] text-sm">
                    Domain
                  </th>
                  <th className="text-left px-6 py-4 font-[Zen_Dots] text-sm">
                    Points
                  </th>
                  <th className="text-left px-6 py-4 font-[Zen_Dots] text-sm">
                    Deadline
                  </th>
                  <th className="text-right px-6 py-4 font-[Zen_Dots] text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-white/60 text-sm"
                    >
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-t border-white/10 hover:bg-white/5"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-white/60 mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-xs uppercase font-[Zen_Dots]">
                          {task.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 font-bold">
                          {task.points} pts
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80">
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString()
                          : "No deadline"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                            title="Edit task"
                          >
                            <Edit size={18} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="p-2 hover:bg-white/10 rounded-lg transition"
                            title="Delete task"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-gray-900 to-black border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-[Zen_Dots]">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-white/10 rounded-lg transition"
                disabled={submitting}
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 px-4 py-3 rounded-lg mb-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-white/70 mb-2">
                  <Tag size={16} className="inline mr-1" />
                  Domain *
                </label>
                <select
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  required
                  disabled={submitting}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 disabled:opacity-50"
                >
                  <option value="web">Web Development</option>
                  <option value="app">App Development</option>
                  <option value="game">Game Development</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  disabled={submitting}
                  placeholder="Enter task title"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  disabled={submitting}
                  placeholder="Describe the task requirements..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    <Award size={16} className="inline mr-1" />
                    Points *
                  </label>
                  <input
                    type="number"
                    value={form.points}
                    onChange={(e) =>
                      setForm({ ...form, points: e.target.value })
                    }
                    required
                    disabled={submitting}
                    min="1"
                    max="1000"
                    placeholder="50"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                    disabled={submitting}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-[Zen_Dots] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-6 py-3 border border-white/20 hover:bg-white/5 rounded-lg font-[Zen_Dots] transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}