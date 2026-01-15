export default function TaskCard({ task, submission, onOpenSubmit }) {
  const status = submission?.status || "Not Submitted";
  const isSubmitted = !!submission;

  return (
    <div
      className={`p-4 rounded-lg transition-all duration-300
        ${
          isSubmitted
            ? "bg-gray-500/20 opacity-70 cursor-not-allowed"
            : "bg-white/5 hover:bg-white/10"
        }`}
    >
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-300">{task.description}</p>
      <p className="mt-2">🎯 {task.points} points</p>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm">
          {status === "Pending" && "🕒 Pending"}
          {status === "Approved" && "✅ Completed"}
          {status === "Rejected" && "❌ Rejected"}
          {status === "Not Submitted" && "🚀 Not Submitted"}
        </span>

        <button
          disabled={isSubmitted}
          onClick={onOpenSubmit}
          className={`px-4 py-2 rounded-lg transition
            ${
              isSubmitted
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700"
            }`}
        >
          {isSubmitted ? "Submitted" : "Submit"}
        </button>
      </div>
    </div>
  );
}
