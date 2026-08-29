export function CardSkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl p-2.5 animate-pulse" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="w-full h-28 rounded-xl mb-2.5" style={{ background: 'var(--border)' }} />
          <div className="h-3 rounded w-3/4 mb-2" style={{ background: 'var(--border)' }} />
          <div className="h-3 rounded w-1/2" style={{ background: 'var(--border)' }} />
        </div>
      ))}
    </div>
  );
}