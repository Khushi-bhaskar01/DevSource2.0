export default function TaskCard({ task, status, locked, onOpenSubmit }) {
  const isCompleted = status === "approved";
  const isPending = status === "pending";

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <h4 className="text-lg font-semibold">{task.title}</h4>
      <p className="text-sm text-gray-400 mb-2">{task.description}</p>

      <div className="flex justify-between items-center">
        <span className="text-sm bg-white/10 px-3 py-1 rounded">
          +{task.points} pts
        </span>

        {locked ? (
          <span className="text-sm text-gray-500">Locked</span>
        ) : isCompleted ? (
          <span className="text-green-400 text-sm font-semibold">
            ✔ Completed
          </span>
        ) : isPending ? (
          <span className="text-yellow-400 text-sm font-semibold">
            ⏳ Under Review
          </span>
        ) : (
          <button
            onClick={onOpenSubmit}
            className="px-4 py-1 rounded bg-pink-500 text-black font-semibold"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
