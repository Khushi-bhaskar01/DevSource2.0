import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function TaskCard({ task, submission, onOpenSubmit, index }) {
  const cardRef = useRef(null);

  /* ================= ANIMATION ================= */
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.08,
        ease: "power2.out",
      }
    );
  }, [index]);

  /* ================= STATUS HANDLING ================= */
  const rawStatus = submission?.status;

  const status =
    rawStatus === "Pending" ||
    rawStatus === "Approved" ||
    rawStatus === "Rejected"
      ? rawStatus
      : "Not Submitted";

  const isSubmitted = !!submission;

  const statusConfig = {
    Pending: {
      icon: "⏳",
      text: "Pending Review",
      color: "text-yellow-400",
      borderColor: "border-yellow-500/40",
    },
    Approved: {
      icon: "✓",
      text: "Approved",
      color: "text-green-400",
      borderColor: "border-green-500/40",
    },
    Rejected: {
      icon: "✗",
      text: "Rejected",
      color: "text-red-400",
      borderColor: "border-red-500/40",
    },
    "Not Submitted": {
      icon: "○",
      text: "Open",
      color: "text-gray-400",
      borderColor: "border-gray-600/40",
    },
  };

  const config = statusConfig[status] || statusConfig["Not Submitted"];

  /* ================= RENDER ================= */
  return (
    <div
      ref={cardRef}
      className={`group relative rounded-xl transition-all duration-300 border-2 ${
        isSubmitted
          ? "bg-zinc-900/60 border-zinc-700/60 opacity-75"
          : "bg-zinc-900/80 border-zinc-700/60 hover:border-purple-500/60 hover:-translate-y-1"
      }`}
    >
      <div className="p-5 space-y-4">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white leading-tight flex-1 font-mono">
            {task.title}
          </h3>
          <span className="shrink-0 px-2.5 py-1 text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded">
            {task.domain?.toUpperCase()}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
          {task.description}
        </p>

        {/* POINTS */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 text-sm font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
            {task.points} pts
          </span>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-zinc-800" />

        {/* STATUS + ACTION */}
        <div className="flex items-center justify-between gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded border ${config.borderColor} bg-black/20`}
          >
            <span className={`${config.color} text-sm font-mono`}>
              {config.icon}
            </span>
            <span className={`text-sm font-medium ${config.color}`}>
              {config.text}
            </span>
          </div>

          <button
            disabled={isSubmitted}
            onClick={onOpenSubmit}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isSubmitted
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500 text-white"
            }`}
          >
            {isSubmitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </div>

      {!isSubmitted && (
        <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-purple-500/20 to-transparent rounded-xl" />
        </div>
      )}
    </div>
  );
}
