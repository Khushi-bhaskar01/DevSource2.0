import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskSubmitModal from "../components/TaskSubmitModal";
import ProgressBar from "../components/ProgressBar";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const DOMAINS = ["web", "app", "game"];

export default function Tasks() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeDomain, setActiveDomain] = useState("web");
  const [tasks, setTasks] = useState([]);
  const [myTaskStatus, setMyTaskStatus] = useState({});
  const [modalTask, setModalTask] = useState(null);

  const [userPoints, setUserPoints] = useState(0);

  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    let mounted = true;

    const fetchAll = async () => {
      setLoading(true);
      setError("");

      try {
        /* USER DATA (ONLY POINTS) */
        const ur = await api.get("/api/user/data");
        if (mounted) setUserPoints(ur.data?.points || 0);

        /* ALL TASKS */
        const tr = await api.get("/api/user/tasks");
        if (mounted) setTasks(tr.data?.tasks || []);

        /* USER TASK STATUS */
        const usr = await api.get("/api/user/tasks-status");
        const map = {};
        (usr.data?.tasks || []).forEach((t) => {
          map[String(t.taskid)] = {
            status: t.status?.toLowerCase(),
            github: t.github,
            demo: t.demo,
          };
        });
        if (mounted) setMyTaskStatus(map);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();

    return () => (mounted = false);
  }, [token, navigate]);

  /* ================= HELPERS ================= */
  const deriveLevel = (pts) => {
    if (pts <= 50) return "beginner";
    if (pts <= 150) return "intermediate";
    return "advanced";
  };

  const isLocked = (level) => {
    if (level === "intermediate") return userPoints < 100;
    if (level === "advanced") return userPoints < 200;
    return false;
  };

  const filteredTasks = tasks
    .filter((t) => t.domain === activeDomain)
    .map((t) => ({
      ...t,
      taskid: String(t.taskid),
      level: deriveLevel(Number(t.points || 0)),
    }));

  const grouped = { beginner: [], intermediate: [], advanced: [] };
  filteredTasks.forEach((t) => grouped[t.level]?.push(t));

  /* ================= SUBMIT ================= */
  const handleSubmitProof = async ({ taskid, github, demo }) => {
    const res = await api.post("/api/user/submit-task", {
      taskid,
      github,
      demo,
    });

    const ut = res.data?.userTask;
    if (ut?.taskid) {
      setMyTaskStatus((prev) => ({
        ...prev,
        [String(ut.taskid)]: {
          status: ut.status?.toLowerCase() || "pending",
          github: ut.github,
          demo: ut.demo,
        },
      }));
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <Navbar />
        <p className="text-center mt-10 animate-pulse">
          Loading tasks...
        </p>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-8">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-[Zen_Dots]">
            Tasks
          </h1>
          <div className="w-80">
            <ProgressBar points={userPoints} />
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

        {error && <p className="text-red-400">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["beginner", "intermediate", "advanced"].map((lvl) => (
            <div key={lvl}>
              <h3 className="text-xl mb-3 capitalize">{lvl}</h3>
              <div className="bg-white/5 p-4 rounded-lg">
                {grouped[lvl].length === 0 && (
                  <p className="text-gray-400">No tasks</p>
                )}
                {grouped[lvl].map((t) => (
                  <TaskCard
                    key={t.taskid}
                    task={t}
                    locked={isLocked(lvl)}
                    status={myTaskStatus[t.taskid]?.status || "idle"}
                    onOpenSubmit={() => setModalTask(t)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {modalTask && (
          <TaskSubmitModal
            open
            task={modalTask}
            onClose={() => setModalTask(null)}
            onSubmit={handleSubmitProof}
          />
        )}
      </div>
    </div>
  );
}

