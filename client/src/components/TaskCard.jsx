export default function TaskCard({ task, submission, onOpenSubmit }) {
  const status = submission?.status || "Not Submitted";

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>🎯 {task.points} points</p>

      <div className="flex justify-between">
        <span>
          {status === "Pending" && "🕒 Pending"}
          {status === "Approved" && "✅ Completed"}
          {status === "Rejected" && "❌ Rejected"}
          {status === "Not Submitted" && "🚀 Not Submitted"}
        </span>

        <button
          disabled={!!submission}
          onClick={onOpenSubmit}
        >
          {submission ? "Submitted" : "Submit"}
        </button>
      </div>
    </div>
  );
}
