import { Link } from 'react-router-dom';
import FreshnessRing from './FreshnessRing';

export default function ProductCard({ product }) {
  const daysLeft = Math.ceil((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  const discountPercent = Math.round((1 - product.sellingPrice / product.price) * 100);

  return (
    <Link
      to={`/buyer/product/${product._id}`}
      className="rounded-2xl overflow-hidden block transition-transform hover:-translate-y-0.5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="relative">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-28 sm:h-32 object-cover" />
        ) : (
          <div className="w-full h-28 sm:h-32" style={{ background: 'var(--brand-light)' }} />
        )}

        {discountPercent > 0 && (
          <span
            className="absolute top-2 left-2 text-white text-[11px] font-bold px-2 py-0.5 rounded-md"
            style={{ background: 'var(--accent)' }}
          >
            {discountPercent}% OFF
          </span>
        )}

        <div className="absolute top-1.5 right-1.5">
          <FreshnessRing daysLeft={daysLeft} size={32} />
        </div>
      </div>

      <div className="p-2.5">
        <p className="text-[10px] uppercase tracking-wide font-semibold" style={{ color: 'var(--ink-muted)' }}>
          {product.category}
        </p>
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <div className="flex items-baseline gap-1.5 mt-1 tabular">
          <span className="font-display font-bold text-base" style={{ color: 'var(--brand)' }}>
            ₹{product.sellingPrice}
          </span>
          <span className="text-xs line-through" style={{ color: 'var(--ink-muted)' }}>₹{product.price}</span>
        </div>
      </div>
    </Link>
  );
}