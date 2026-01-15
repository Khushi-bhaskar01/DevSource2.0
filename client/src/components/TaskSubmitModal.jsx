import React, { useEffect, useState } from "react";

export default function TaskSubmitModal({ open, onClose, onSubmit, task }) {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setLink("");
      setError("");
      setLoading(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-[#111] p-6 rounded-xl">
        <h2 className="text-xl mb-2">Submit Task</h2>
        <p className="text-gray-400 mb-4">{task.title}</p>

        <input
          className="w-full mb-3 p-2 rounded bg-white/10 outline-none"
          placeholder="GitHub / Demo link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-black rounded disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
