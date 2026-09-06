const statusColor = {
  approved: 'var(--brand)',
  rejected: 'var(--danger)',
};

export default function HistoryCard({ inspection }) {
  const product = inspection.productId;
  if (!product) return null;

  return (
    <div className="rounded-2xl p-4 mb-3 flex gap-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      {product.images?.[0] && (
        <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-sm">{product.name}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white capitalize shrink-0" style={{ background: statusColor[inspection.status] }}>
            {inspection.status}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
          Decided: {new Date(inspection.inspectedAt).toLocaleDateString()}
        </p>
        {inspection.status === 'approved' && (
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
              Paid to seller: ₹{product.sellerNetPayout ?? product.totalBuyingPrice} · Your earning: ₹{inspection.visitEarning}
            </p>
          )}
        {inspection.status === 'rejected' && inspection.notes && (
          <p className="text-xs mt-1 italic" style={{ color: 'var(--ink-muted)' }}>
            "{inspection.notes}"
          </p>
        )}
      </div>
    </div>
  );
}