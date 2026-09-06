import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import FreshnessRing from '../../components/FreshnessRing';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);  
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/public/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10 text-center">Loading...</div>;
  if (error) return <div className="max-w-6xl mx-auto px-4 py-10 text-center" style={{ color: 'var(--danger)' }}>{error}</div>;

  const discountPercent = Math.round((1 - product.sellingPrice / product.price) * 100);

  const handleAddToCart = () => {
  addToCart(product, { discountedPrice: product.sellingPrice }, qty);
  setAdded(true);
  setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-80 md:h-[420px] object-cover" />
          ) : (
            <div className="w-full h-80 md:h-[420px]" style={{ background: 'var(--brand-light)' }} />
          )}
          <div className="absolute top-3 right-3">
            <FreshnessRing daysLeft={product.daysLeft} size={48} />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: 'var(--ink-muted)' }}>
            {product.category}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mt-1">{product.name}</h1>

          <div className="flex items-baseline gap-3 mt-4 tabular">
            <span className="font-display text-3xl font-extrabold" style={{ color: 'var(--brand)' }}>
              ₹{product.sellingPrice}
            </span>
            <span className="text-base line-through" style={{ color: 'var(--ink-muted)' }}>₹{product.price}</span>
            {discountPercent > 0 && (
              <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{discountPercent}% off</span>
            )}
          </div>

          <div className="rounded-xl p-4 mt-5 text-sm space-y-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p>Quantity available: <strong>{product.quantity}</strong></p>
            <p>Expires: <strong>{new Date(product.expiryDate).toLocaleDateString()}</strong></p>
            <p>{product.daysLeft} days remaining before expiry</p>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center rounded-lg" style={{ border: '1px solid var(--border)' }}>
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5 text-lg">−</button>
              <span className="px-4 tabular">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(product.quantity, q + 1))} className="px-3 py-1.5 text-lg">+</button>
            </div>
            <span className="text-xs" style={{ color: 'var(--ink-muted)' }}>{product.quantity} available</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="text-white px-4 py-3 rounded-xl w-full mt-6 font-semibold transition-colors md:w-auto md:px-10"
            style={{ background: added ? 'var(--brand-dark)' : 'var(--brand)' }}
          >
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}