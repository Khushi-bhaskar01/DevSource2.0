import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function TaskSubmitModal({ open, onClose, onSubmit, task }) {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      setLink("");
      setError("");
      setLoading(false);

      // Animate modal entrance
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );

      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out", delay: 0.1 }
      );
    }
  }, [open]);

  if (!open || !task) return null;

  const handleSubmit = async () => {
    if (!link.trim()) {
      setError("Submission link is required");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        taskId: task._id,
        submissionLink: link.trim(),
      });
      onClose();
    } catch (err) {
      setError("You have already submitted this task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-zinc-900 border-2 border-zinc-700/80 rounded-xl shadow-2xl"
      >
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white font-mono">
                Submit Task
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <h3 className="text-lg font-semibold text-gray-300">
                {task.title}
              </h3>
              <span className="px-2.5 py-1 text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                {task.points} pts
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-gray-400 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Input Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300 font-mono">
              Submission Link *
            </label>
            <input
              type="url"
              className="w-full px-4 py-3 bg-black/40 border-2 border-zinc-700/60 rounded-lg outline-none focus:border-purple-500/60 transition-colors text-white placeholder-gray-500 font-mono text-sm"
              placeholder="https://github.com/username/repo or demo-link.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 font-mono">
              Provide a link to your GitHub repository or live demo
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-lg">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !link.trim()}
              className="px-5 py-2.5 text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Task"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}