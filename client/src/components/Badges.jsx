export default function Badges({ badges }) {
  if (!badges || badges.length === 0) {
    return (
      <p className="text-gray-400 text-sm">No badges earned yet</p>
    );
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {badges.map(badge => (
        <div key={badge.badgeId} className="text-center">
          <img
            src={`/badges/${badge.badgeId}.png`}
            alt={badge.badgeId}
            className="w-16 h-16 hover:scale-110 transition"
          />
        </div>
      ))}
    </div>
  );
}
