import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskSubmitModal from "../components/TaskSubmitModal";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const DOMAINS = ["web", "app", "game"];
const POINT_CATEGORIES = ["Beginner", "Intermediate", "Advanced"];

export default function Tasks() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [modalTask, setModalTask] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [activeDomain, setActiveDomain] = useState("web");
  const [activeCategory, setActiveCategory] = useState("Beginner");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (authLoading) return;

    // Redirect to login if not authenticated
    if (!authUser?._id) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setError("");

        /* USER POINTS - get from authUser or fetch fresh */
        if (authUser.points !== undefined) {
          setUserPoints(authUser.points || 0);
        } else {
          const userRes = await api.get("/api/user/data");
          setUserPoints(userRes.data?.userData?.points || userRes.data?.points || 0);
        }

        /* TASKS */
        const taskRes = await api.get("/api/tasks");
        const tasksData = Array.isArray(taskRes.data) 
          ? taskRes.data 
          : taskRes.data?.tasks || [];
        setTasks(tasksData);

        /* MY SUBMISSIONS */
        const submissionRes = await api.get("/api/submissions/my");
        const submissionsData = Array.isArray(submissionRes.data)
          ? submissionRes.data
          : submissionRes.data?.submissions || [];

        const map = {};
        submissionsData.forEach((sub) => {
          // Handle both populated and non-populated taskId
          const taskId = sub.taskId?._id || sub.taskId || sub.task?._id || sub.task;
          if (taskId) {
            map[taskId] = sub;
          }
        });

        setSubmissions(map);
      } catch (err) {
        console.error("Tasks fetch error:", err);
        setError(err.response?.data?.message || "Failed to load tasks");
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser, authLoading, navigate]);

  /* ================= SUBMIT ================= */
  const handleSubmitProof = async ({ taskId, submissionLink }) => {
    try {
      setError("");
      
      const res = await api.post("/api/submissions", {
        taskId,
        submissionLink,
      });

      const newSubmission = res.data?.submission || res.data;

      // Update submissions map
      setSubmissions((prev) => ({
        ...prev,
        [taskId]: newSubmission,
      }));

      // Close modal
      setModalTask(null);

      // Optionally refresh user points
      try {
        const userRes = await api.get("/api/user/data");
        setUserPoints(userRes.data?.userData?.points || userRes.data?.points || 0);
      } catch (err) {
        console.error("Failed to refresh points:", err);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || "Failed to submit task");
      throw err; // Re-throw so modal can handle it
    }
  };

  /* ================= FILTER ================= */
  const filteredTasks = tasks.filter((t) => {
    if (t.domain !== activeDomain) return false;

    if (activeCategory === "Beginner" && t.points <= 50) return true;
    if (
      activeCategory === "Intermediate" &&
      t.points > 50 &&
      t.points <= 200
    )
      return true;
    if (activeCategory === "Advanced" && t.points > 200) return true;

    return false;
  });

  /* ================= LOADING ================= */
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

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-[Zen_Dots]">Tasks</h1>

          {/* TOTAL POINTS */}
          <div className="bg-green-500/20 border border-green-500 px-6 py-3 rounded-xl">
            <p className="text-sm text-green-300">Total Points</p>
            <p className="text-2xl font-bold text-green-400">
              {userPoints} pts
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 px-4 py-3 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* DOMAIN FILTER */}
        <div className="flex gap-4 flex-wrap">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={`px-4 py-2 rounded-lg font-[Zen_Dots] uppercase text-sm transition ${
                activeDomain === d
                  ? "bg-pink-500 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white/80"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* POINT FILTER */}
        <div className="flex gap-4 flex-wrap">
          {POINT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg font-[Zen_Dots] text-sm transition ${
                activeCategory === cat
                  ? "bg-green-500 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* TASK GRID */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/60 font-[Zen_Dots]">
              No tasks found for {activeDomain.toUpperCase()} - {activeCategory}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredTasks.map((task) => {
              const submission = submissions[task._id];
              return (
                <TaskCard
                  key={task._id}
                  task={task}
                  submission={submission || null}
                  onOpenSubmit={() => {
                    // Don't allow resubmission if already submitted
                    if (submission) return;
                    setModalTask(task);
                  }}
                />
              );
            })}
          </div>
        )}

        {/* SUBMIT MODAL */}
        {modalTask && (
          <TaskSubmitModal
            open
            task={modalTask}
            onClose={() => setModalTask(null)}
            onSubmit={({ submissionLink }) =>
              handleSubmitProof({
                taskId: modalTask._id,
                submissionLink,
              })
            }
          />
        )}
      </div>
    </div>
  );
}