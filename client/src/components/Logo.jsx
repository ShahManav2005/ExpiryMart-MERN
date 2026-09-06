export default function Logo({ size = 36, showWordmark = true }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="44" height="44" rx="13" fill="#0F766E" />
        <path
          d="M24 10c-6 0-11 6-11 13 0 5.5 4.5 10 11 10s11-4.5 11-10c0-7-5-13-11-13z"
          fill="white"
        />
        <line x1="24" y1="33" x2="24" y2="22" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
        <circle cx="35" cy="13" r="5" fill="#F59E0B" />
      </svg>
      {showWordmark && (
        <span className="font-display font-extrabold" style={{ fontSize: size * 0.5, color: '#0F766E' }}>
          ExpiryMart
        </span>
      )}
    </div>
  );
}