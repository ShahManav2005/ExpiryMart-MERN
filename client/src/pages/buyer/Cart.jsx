import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import EmptyState from '../../components/EmptyState';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <EmptyState
          title="Your cart is empty"
          subtitle="Browse products and rescue a deal"
          action={<Link to="/buyer/dashboard" className="font-semibold" style={{ color: 'var(--brand)' }}>Browse products →</Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="font-display text-xl font-bold mb-6">Your Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: item list */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              {item.image && (
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs tabular" style={{ color: 'var(--ink-muted)' }}>₹{item.price} each</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                <input
                  type="number"
                  min="1"
                  max={item.maxQuantity}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  className="border rounded-lg w-16 p-1.5 text-center text-sm"
                  style={{ borderColor: 'var(--border)' }}
                />
                <p className="w-16 text-right text-sm font-semibold tabular">₹{item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.productId)} className="text-xs font-medium" style={{ color: 'var(--danger)' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: order summary, sticky */}
        <div className="lg:sticky lg:top-20 rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <h2 className="font-display font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between text-sm mb-2 tabular" style={{ color: 'var(--ink-muted)' }}>
            <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
            <span>₹{totalAmount}</span>
          </div>

          <div
            className="flex justify-between font-display font-bold text-lg tabular pt-3 mt-3"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <Link
            to="/buyer/checkout"
            className="text-white px-4 py-3 rounded-xl w-full mt-5 block text-center font-semibold"
            style={{ background: 'var(--brand)' }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}