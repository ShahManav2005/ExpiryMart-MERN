export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="text-center py-16 px-4">
      <div
        className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
        style={{ background: 'var(--brand-light)' }}
      >
        🛒
      </div>
      <p className="font-display font-semibold">{title}</p>
      {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--ink-muted)' }}>{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}