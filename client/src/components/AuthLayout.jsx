import Logo from './Logo';

export default function AuthLayout({ children, tagline }) {
  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)' }}
      >
        <Logo size={40} />

        <div className="relative z-10">
          <h2 className="font-display text-3xl font-extrabold text-white mb-3 leading-tight">
            {tagline || 'Rescue near-expiry essentials at real savings'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--brand-light)' }}>
            Every listing is physically inspected and verified before it reaches you.
          </p>
        </div>

        <p className="text-xs relative z-10" style={{ color: 'var(--brand-light)' }}>
          © 2026 ExpiryMart — demonstration project
        </p>

        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute -left-10 bottom-20 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: 'var(--surface-muted)' }}>
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size={36} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}