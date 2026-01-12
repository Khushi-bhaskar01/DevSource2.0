import React from "react";

export default function ProgressBar({ points }) {
  const safePoints = Number(points) || 0;

  let min = 0;
  let max = 100;
  let label = "Beginner";

  if (safePoints >= 200) {
    min = 200;
    max = 400;
    label = "Advanced";
  } else if (safePoints >= 100) {
    min = 100;
    max = 200;
    label = "Intermediate";
  }

  const raw = ((safePoints - min) / (max - min)) * 100;
  const pct = Math.min(100, Math.max(5, Math.round(raw)));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{label} Progress</div>
        <div className="text-sm text-gray-300">{safePoints} pts</div>
      </div>

      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-yellow-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
