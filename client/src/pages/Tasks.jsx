import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TaskSubmitModal from "../components/TaskSubmitModal";
import api from "../api/axiosInstance";
import { ChevronRight } from "lucide-react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, submissionRes] = await Promise.all([
          api.get("/api/tasks"),
          api.get("/api/submissions/my"),
        ]);

        setTasks(
          Array.isArray(taskRes.data)
            ? taskRes.data
            : taskRes.data?.tasks || []
        );

        setSubmissions(submissionRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.domain === filter);
  }, [tasks, filter]);

  const handleOpenModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getSubmissionForTask = (taskId) => {
  return submissions.find(
    (s) => (s.taskId?._id || s.taskId) === taskId
  );
};

  const handleSubmitTask = async (submissionData) => {
    try {
      await api.post("/api/submissions", submissionData);
      alert("MISSION TRANSMITTED SUCCESSFULLY.");
    } catch (err) {
      throw err;
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-black uppercase tracking-[0.5em] text-[10px]">
        INITIALIZING_OBJECTIVES...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-premium-accent/30 font-inter">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-40 pb-20">
        <header className="mb-20 border-b border-white/5 pb-10">
          <span className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[9px] block mb-4">
            / OBJECTIVES
          </span>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            MISSION <span className="text-zinc-800">LOG</span>.
          </h1>
        </header>

        {/* FILTER */}
        <div className="flex gap-8 mb-12">
          {["all", "web", "app", "game"].map((domain) => (
            <button
              key={domain}
              onClick={() => setFilter(domain)}
              className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === domain
                  ? "text-premium-accent"
                  : "text-zinc-600 hover:text-white"
              }`}
            >
              [{domain}]
            </button>
          ))}
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {filteredTasks.map((task, idx) => {
            const submission = getSubmissionForTask(task._id);
            const isSubmitted = !!submission;

            return (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  if (!isSubmitted) handleOpenModal(task);
                }}
                className={`group border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all
                ${
                  isSubmitted
                    ? "bg-zinc-900 opacity-50 cursor-not-allowed"
                    : "bg-white/2 cursor-pointer hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">
                      {task.domain}
                    </span>

                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-premium-accent transition-colors">
                      {task.title}
                    </h3>
                  </div>

                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide line-clamp-1">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center gap-10">
                  {isSubmitted && (
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">
                      SUBMITTED
                    </span>
                  )}

                  <div className="text-right">
                    <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest block">
                      PRIORITY
                    </span>

                    <span className="text-xs font-black text-white">
                      {task.points} XP
                    </span>
                  </div>

                  <ChevronRight
                    className={`transition-all ${
                      isSubmitted
                        ? "text-zinc-800"
                        : "text-zinc-800 group-hover:translate-x-1 group-hover:text-white"
                    }`}
                    size={20}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="py-40 text-center border-t border-white/5 mt-10">
            <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[1em]">
              LOGS_EMPTY
            </p>
          </div>
        )}
      </main>

      <TaskSubmitModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
        task={selectedTask}
      />

      <Footer />
    </div>
  );
}