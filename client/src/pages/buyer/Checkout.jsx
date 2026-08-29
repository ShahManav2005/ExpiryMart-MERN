import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';

const methods = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };

  const validatePaymentDetails = () => {
    if (method === 'upi') {
      if (!/^[\w.-]+@[\w]+$/.test(upiId)) {
        return 'Enter a valid UPI ID, e.g. name@bank';
      }
    }
    if (method === 'card') {
      if (card.number.replace(/\s/g, '').length !== 16) return 'Card number must be 16 digits';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Expiry must be in MM/YY format';
      if (card.cvv.length !== 3) return 'CVV must be 3 digits';
      if (!card.name.trim()) return 'Enter the name on card';
    }
    return '';
  };

  const handlePay = async () => {
    setError('');
    const validationError = validatePaymentDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessing(true);
    try {
      // simulate a payment processing delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const orderItems = items.map((item) => ({ productId: item.productId, quantity: item.quantity }));
      const { data } = await api.post('/orders', { items: orderItems, paymentMethod: method });

      clearCart();
      navigate(`/buyer/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return <div className="max-w-2xl mx-auto px-4 py-10 text-center" style={{ color: 'var(--ink-muted)' }}>Your cart is empty.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="font-display text-xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: payment method selection */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={cardStyle}>
          <h2 className="font-display font-semibold mb-4">Select payment method</h2>

          <div className="space-y-2 mb-5">
            {methods.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                style={{
                  border: `1.5px solid ${method === m.id ? 'var(--brand)' : 'var(--border)'}`,
                  background: method === m.id ? 'var(--brand-light)' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.id}
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="accent-current"
                  style={{ accentColor: 'var(--brand)' }}
                />
                <span className="text-lg">{m.icon}</span>
                <span className="font-medium text-sm">{m.label}</span>
              </label>
            ))}
          </div>

          {method === 'upi' && (
            <div>
              <label className="text-sm font-medium block mb-1">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@bank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="border rounded-lg p-2.5 w-full text-sm max-w-sm"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          )}

          {method === 'card' && (
            <div className="space-y-3 max-w-sm">
              <div>
                <label className="text-sm font-medium block mb-1">Card number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  value={card.number}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
                    setCard({ ...card, number: formatted });
                  }}
                  className="border rounded-lg p-2.5 w-full text-sm tabular"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={card.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
                      setCard({ ...card, expiry: val });
                    }}
                    className="border rounded-lg p-2.5 w-full text-sm tabular"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium block mb-1">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength={3}
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    className="border rounded-lg p-2.5 w-full text-sm tabular"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Name on card</label>
                <input
                  type="text"
                  placeholder="As shown on card"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                  className="border rounded-lg p-2.5 w-full text-sm"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>
          )}

          {method === 'cod' && (
            <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
              Pay in cash when your order arrives.
            </p>
          )}
        </div>

        {/* Right: order summary */}
        <div className="lg:sticky lg:top-20 rounded-2xl p-5" style={cardStyle}>
          <h2 className="font-display font-semibold mb-4">Order Summary</h2>

          {items.map((item) => (
            <div key={item.productId} className="flex justify-between py-1.5 text-sm tabular">
              <span className="truncate pr-2">{item.name} × {item.quantity}</span>
              <span className="shrink-0">₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div
            className="flex justify-between font-display font-bold text-lg mt-3 pt-3 tabular"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          {error && <p className="text-sm mt-3" style={{ color: 'var(--danger)' }}>{error}</p>}

          <button
            onClick={handlePay}
            disabled={processing}
            className="text-white px-4 py-3 rounded-xl w-full mt-4 font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: 'var(--brand)' }}
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing payment...
              </>
            ) : (
              `Pay ₹${totalAmount}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}