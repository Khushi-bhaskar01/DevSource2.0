import React, { useState, useEffect } from "react";

export default function TaskSubmitModal({ open, onClose, onSubmit, task }) {
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setGithub("");
      setDemo("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  if (!open || !task) return null;

  const handleSubmit = async () => {
    setError("");

    if (!github.trim()) {
      setError("GitHub link is required");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        taskid: task.taskid,
        github: github.trim(),
        demo: demo.trim(),
      });
      onClose();
    } catch (err) {
      setError("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl bg-[#111] p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-1">Submit Task Proof</h2>
        <p className="text-sm text-gray-400 mb-4">{task.title}</p>

        <label className="text-sm text-gray-300">GitHub Link *</label>
        <input
          className="w-full mt-1 mb-3 rounded bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="https://github.com/your/repo"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
        />

        <label className="text-sm text-gray-300">Demo Link (optional)</label>
        <input
          className="w-full mt-1 mb-3 rounded bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="https://your-demo.com"
          value={demo}
          onChange={(e) => setDemo(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 rounded bg-pink-500 text-black font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
