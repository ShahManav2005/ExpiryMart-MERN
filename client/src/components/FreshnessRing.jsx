export default function FreshnessRing({ daysLeft, size = 36 }) {
  const pct = Math.max(4, Math.min(100, Math.round((daysLeft / 90) * 100)));
  const color = daysLeft <= 7 ? 'var(--danger)' : daysLeft <= 30 ? 'var(--accent)' : 'var(--brand)';

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, background: `conic-gradient(${color} ${pct}%, #E4E7E5 0)` }}
      title={`${daysLeft} days until expiry`}
    >
      <div
        className="rounded-full bg-white flex items-center justify-center font-bold tabular"
        style={{ width: size - 7, height: size - 7, fontSize: size * 0.26, color }}
      >
        {daysLeft}
      </div>
    </div>
  );
}