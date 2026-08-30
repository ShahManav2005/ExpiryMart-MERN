export default function RulesCard() {
  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      <h2 className="font-display font-semibold mb-3">Inspection Guidelines</h2>
      <ul className="text-sm space-y-2" style={{ color: 'var(--ink-muted)' }}>
        <li> <strong style={{ color: 'var(--ink)' }}>Minimum shelf life:</strong> product must have at least 30 days remaining before expiry to be approved.</li>
        <li> <strong style={{ color: 'var(--ink)' }}>Valid category:</strong> only FMCG and OTC Medicine listings are accepted.</li>
        <li> <strong style={{ color: 'var(--ink)' }}>Physical check:</strong> confirm packaging is sealed and undamaged before approving.</li>
        <li> <strong style={{ color: 'var(--ink)' }}>Expiry date visibility:</strong> the printed expiry date on the product must be clearly visible and legible before accepting it from the seller — do not approve if it's smudged, torn, or unreadable.</li>
        <li> <strong style={{ color: 'var(--ink)' }}>Your earning:</strong> 10% commission on the buyer's final selling price for every approved product.</li>
        <li> <strong style={{ color: 'var(--ink)' }}>Rejections</strong> forfeit the seller's ₹100 inspection fee; approvals refund it in full. Always note the specific reason.</li>
      </ul>
    </div>
  );
}