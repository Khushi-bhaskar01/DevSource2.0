import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskSubmitModal from "../components/TaskSubmitModal";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const DOMAINS = ["web", "app", "game"];
const POINT_CATEGORIES = ["Beginner", "Intermediate", "Advanced"];

export default function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [modalTask, setModalTask] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [activeDomain, setActiveDomain] = useState("web");
  const [activeCategory, setActiveCategory] = useState("Beginner");
  const [loading, setLoading] = useState(true);

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        /* USER */
        const userRes = await api.get("/api/user/data");
        setUserPoints(userRes.data?.points || 0);

        /* TASKS */
        const taskRes = await api.get("/api/tasks");
        setTasks(Array.isArray(taskRes.data) ? taskRes.data : []);

        /* MY SUBMISSIONS */
        const submissionRes = await api.get("/api/submissions/my");

        const map = {};
        if (Array.isArray(submissionRes.data)) {
          submissionRes.data.forEach((sub) => {
            if (sub.taskId && sub.taskId._id) {
              map[sub.taskId._id] = sub;
            }
          });
        }

        setSubmissions(map);
      } catch (err) {
        console.error("Tasks fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  /* ================= SUBMIT ================= */
  const handleSubmitProof = async ({ taskId, submissionLink }) => {
    const res = await api.post("/api/submissions", {
      taskId,
      submissionLink,
    });

    setSubmissions((prev) => ({
      ...prev,
      [taskId]: res.data.submission,
    }));
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
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <Navbar />
        <p className="text-center animate-pulse">Loading tasks...</p>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 space-y-6">
         <div className="flex justify-between items-center">
          <h1 className="text-3xl font-[Zen_Dots]">Tasks</h1>

           {/* TOTAL POINTS */}
           <div className="bg-green-500/20 border border-green-500 px-6 py-3 rounded-xl">
           <p className="text-sm text-green-300">Total Points</p>
           <p className="text-2xl font-bold text-green-400">
              {userPoints} pts
           </p>
          </div>

         
        </div>

        {/* DOMAIN FILTER */}
        <div className="flex gap-4">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d)}
              className={`px-4 py-2 rounded ${
                activeDomain === d
                  ? "bg-pink-500"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {d.toUpperCase()}
            </button>
          ))}
        </div>

        {/* POINT FILTER */}
        <div className="flex gap-4">
          {POINT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded ${
                activeCategory === cat
                  ? "bg-green-500"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* TASK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              submission={submissions[task._id] || null}
              onOpenSubmit={() => {
                if (submissions[task._id]) return;
                setModalTask(task);
              }}
            />
          ))}
        </div>

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
