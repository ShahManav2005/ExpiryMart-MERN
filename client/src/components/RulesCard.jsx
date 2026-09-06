export default function RulesCard() {
  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      <h2 className="font-display font-semibold mb-3">Inspection Guidelines</h2>
      <ul className="text-sm space-y-2" style={{ color: 'var(--ink-muted)' }}>
        <li>📏 <strong style={{ color: 'var(--ink)' }}>Your earning:</strong> a flat ₹30 per task (inspection pickup or delivery), as long as the location is within 8.75km of the warehouse.</li>
        <li>🚫 <strong style={{ color: 'var(--ink)' }}>Distance limit:</strong> locations beyond 8.75km from the warehouse cannot be accepted for pickup or delivery.</li>
        <li>💸 <strong style={{ color: 'var(--ink)' }}>Distance charges:</strong> free within 3.75km; ₹10 charge for 3.76–5km; ₹20 charge for 5.01–8.75km — deducted from the seller's payout on pickup, added to the buyer's bill on delivery.</li>
      </ul>
    </div>
  );
}