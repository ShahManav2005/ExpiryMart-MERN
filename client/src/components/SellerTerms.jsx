export default function SellerTerms() {
  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      <h2 className="font-display font-semibold mb-3">Seller Terms & Conditions</h2>
      <ul className="text-sm space-y-2" style={{ color: 'var(--ink-muted)' }}>
        <li><strong style={{ color: 'var(--ink)' }}>Sealed packaging only:</strong> products must be listed in their original, unopened, sealed packaging.</li>
        <li><strong style={{ color: 'var(--ink)' }}>Inspection fee:</strong> a ₹100 fee applies per product submitted. It's refunded in full if approved, forfeited if rejected.</li>
        <li><strong style={{ color: 'var(--ink)' }}>Minimum shelf life:</strong> at least 30 days must remain before expiry at the time of listing.</li>
        <li><strong style={{ color: 'var(--ink)' }}>Accepted categories:</strong> only FMCG and OTC Medicine products are accepted.</li>
        <li><strong style={{ color: 'var(--ink)' }}>Physical verification:</strong> a field agent will inspect and collect the product from your address before it's paid for and listed.</li>
        <li><strong style={{ color: 'var(--ink)' }}>Payment:</strong> you're paid a percentage of MRP (based on remaining shelf life) directly by the agent at pickup — not by the buyer.</li>
      </ul>
    </div>
  );
}