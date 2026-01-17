import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
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

  const headerRef = useRef(null);
  const pointsRef = useRef(null);
  const filtersRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !loading) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        pointsRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );

      gsap.fromTo(
        filtersRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: "power2.out" }
      );
    }
  }, [authLoading, loading]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (authLoading) return;

    if (!authUser?._id) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setError("");

        if (authUser.points !== undefined) {
          setUserPoints(authUser.points || 0);
        } else {
          const userRes = await api.get("/api/user/data");
          setUserPoints(userRes.data?.userData?.points || userRes.data?.points || 0);
        }

        const taskRes = await api.get("/api/tasks");
        const tasksData = Array.isArray(taskRes.data) 
          ? taskRes.data 
          : taskRes.data?.tasks || [];
        setTasks(tasksData);

        const submissionRes = await api.get("/api/submissions/my");
        const submissionsData = Array.isArray(submissionRes.data)
          ? submissionRes.data
          : submissionRes.data?.submissions || [];

        const map = {};
        submissionsData.forEach((sub) => {
          const taskId = sub.taskId?._id || sub.taskId || sub.task?._id || sub.task;
          if (taskId) {
            map[taskId] = sub;
          }
        });

        setSubmissions(map);
      } catch (err) {
        console.error("Tasks fetch error:", err);
        setError(err.response?.data?.message || "Failed to load tasks");
        
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

      setSubmissions((prev) => ({
        ...prev,
        [taskId]: newSubmission,
      }));

      setModalTask(null);

      try {
        const userRes = await api.get("/api/user/data");
        setUserPoints(userRes.data?.userData?.points || userRes.data?.points || 0);
      } catch (err) {
        console.error("Failed to refresh points:", err);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.message || "Failed to submit task");
      throw err;
    }
  };

  /* ================= FILTER ================= */
  const filteredTasks = tasks.filter((t) => {
    if (t.domain !== activeDomain) return false;

    if (activeCategory === "Beginner" && t.points <= 50) return true;
    if (activeCategory === "Intermediate" && t.points > 50 && t.points <= 200) return true;
    if (activeCategory === "Advanced" && t.points > 200) return true;

    return false;
  });

  /* ================= LOADING ================= */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <Navbar />
        <div className="flex items-center justify-center mt-20">
          <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-700 rounded-lg">
            <svg className="animate-spin h-5 w-5 text-purple-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="font-mono text-sm text-gray-300">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-10 space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-6">
          <h1 
            ref={headerRef}
            className="text-4xl md:text-5xl font-bold font-mono text-white"
          >
            / tasks
          </h1>

          {/* TOTAL POINTS */}
          <div 
            ref={pointsRef}
            className="bg-zinc-900 border-2 border-zinc-700 px-6 py-3 rounded-xl hover:border-purple-500/60 transition-colors"
          >
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Total Points</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {userPoints.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-500/10 border-2 border-red-500/40 px-5 py-4 rounded-xl">
            <p className="text-red-400 font-mono text-sm">{error}</p>
          </div>
        )}

        {/* FILTERS */}
        <div ref={filtersRef} className="space-y-4">
          {/* DOMAIN FILTER */}
          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-mono text-gray-500 self-center mr-2">Domain:</span>
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                  activeDomain === d
                    ? "bg-purple-600 text-white border-2 border-purple-500"
                    : "bg-zinc-900 text-gray-400 border-2 border-zinc-700 hover:border-zinc-600 hover:text-gray-300"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* POINT FILTER */}
          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-mono text-gray-500 self-center mr-2">Level:</span>
            {POINT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white border-2 border-purple-500"
                    : "bg-zinc-900 text-gray-400 border-2 border-zinc-700 hover:border-zinc-600 hover:text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* TASK GRID */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block bg-zinc-900 border-2 border-zinc-700 px-8 py-6 rounded-xl">
              <p className="text-gray-400 font-mono">
                No tasks found for <span className="text-purple-400">{activeDomain}</span> - <span className="text-purple-400">{activeCategory}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
            {filteredTasks.map((task, index) => {
              const submission = submissions[task._id];
              return (
                <TaskCard
                  key={task._id}
                  task={task}
                  submission={submission || null}
                  onOpenSubmit={() => {
                    if (submission) return;
                    setModalTask(task);
                  }}
                  index={index}
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