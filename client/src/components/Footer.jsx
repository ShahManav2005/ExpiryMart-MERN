export default function Footer() {
  return (
    <footer className="mt-12 border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <p className="font-display font-bold mb-2" style={{ color: 'var(--brand)' }}>ExpiryMart</p>
          <p style={{ color: 'var(--ink-muted)' }}>
            ExpiryMart Distribution Warehouse<br />
            Plot No. 42, Shree Industrial Estate<br />
            Makarpura–Maneja Road, Near GIDC Industrial Area<br />
            Vadodara, Gujarat – 390010, India
          </p>
        </div>
        <div>
          <p className="font-display font-semibold mb-2">Contact</p>
          <p style={{ color: 'var(--ink-muted)' }}>support@expirymart.example</p>
          <p style={{ color: 'var(--ink-muted)' }}>Customer Care: +91 98765 43210</p>
        </div>
        <div>
          <p className="font-display font-semibold mb-2">Follow Us</p>
          <p style={{ color: 'var(--ink-muted)' }}>Instagram · Facebook · Twitter</p>
        </div>
      </div>
      <div className="text-center text-xs py-4" style={{ color: 'var(--ink-muted)', borderTop: '1px solid var(--border)' }}>
        © 2026 ExpiryMart. All information on this site (contact details, addresses, social handles) is fictional and created solely for academic demonstration purposes.
      </div>
    </footer>
  );
}