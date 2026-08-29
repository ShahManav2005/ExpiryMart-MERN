export default function BuyerHero() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl mb-8 px-6 py-10 sm:px-10 sm:py-14"
      style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)' }}
    >
      <div className="relative z-10 max-w-xl">
        <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'var(--brand-light)' }}>
          Good products, running out of time
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
          Rescue near-expiry essentials at real savings
        </h1>
        <p className="text-sm sm:text-base mb-6" style={{ color: 'var(--brand-light)' }}>
          Every listing is physically inspected and verified before it reaches you — genuine deals, less waste.
        </p>
        <a
          href="#browse"
          className="inline-block bg-white font-semibold px-5 py-2.5 rounded-xl text-sm"
          style={{ color: 'var(--brand-dark)' }}
        >
          Browse deals ↓
        </a>
      </div>

      <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
      <div className="absolute right-16 bottom-0 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
    </section>
  );
}