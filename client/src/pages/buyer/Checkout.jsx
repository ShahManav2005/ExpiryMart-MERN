import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import OrderInvoice from '../../components/OrderInvoice';

const methods = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
];

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [address, setAddress] = useState(user?.address || '');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };

  const validatePaymentDetails = () => {
    if (!address.trim()) return 'Enter a delivery address';
    if (method === 'upi' && !/^[\w.-]+@[\w]+$/.test(upiId)) return 'Enter a valid UPI ID, e.g. name@bank';
    if (method === 'card') {
      if (card.number.replace(/\s/g, '').length !== 16) return 'Card number must be 16 digits';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Expiry must be in MM/YY format';
      if (card.cvv.length !== 3) return 'CVV must be 3 digits';
    }
    return '';
  };

  const handlePay = async () => {
    setError('');
    const validationError = validatePaymentDetails();
    if (validationError) { setError(validationError); return; }

    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const orderItems = items.map((item) => ({ productId: item.productId, quantity: item.quantity }));
      const { data } = await api.post('/orders', { items: orderItems, paymentMethod: method, deliveryAddress: address });
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

  const previewOrder = {
    items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    totalAmount,
    deliveryAddress: address,
    paymentMethod: method,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="font-display text-xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h2 className="font-display font-semibold mb-3">Delivery Address</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Enter your delivery address"
              className="border rounded-lg p-2.5 w-full text-sm"
              style={{ borderColor: 'var(--border)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>This applies to this order only — your saved profile address won't change.</p>
          </div>

          <div className="rounded-2xl p-5" style={cardStyle}>
            <h2 className="font-display font-semibold mb-4">Select payment method</h2>
            <div className="space-y-2 mb-5">
              {methods.map((m) => (
                <label key={m.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer" style={{ border: `1.5px solid ${method === m.id ? 'var(--brand)' : 'var(--border)'}`, background: method === m.id ? 'var(--brand-light)' : 'transparent' }}>
                  <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} style={{ accentColor: 'var(--brand)' }} />
                  <span className="text-lg">{m.icon}</span>
                  <span className="font-medium text-sm">{m.label}</span>
                </label>
              ))}
            </div>

            {method === 'upi' && (
              <input type="text" placeholder="yourname@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="border rounded-lg p-2.5 w-full text-sm max-w-sm" style={{ borderColor: 'var(--border)' }} />
            )}

            {method === 'card' && (
              <div className="space-y-3 max-w-sm">
                <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={card.number} onChange={(e) => { const digits = e.target.value.replace(/\D/g, '').slice(0, 16); setCard({ ...card, number: digits.replace(/(.{4})/g, '$1 ').trim() }); }} className="border rounded-lg p-2.5 w-full text-sm tabular" style={{ borderColor: 'var(--border)' }} />
                <div className="flex gap-3">
                  <input type="text" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e) => { let val = e.target.value.replace(/\D/g, '').slice(0, 4); if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`; setCard({ ...card, expiry: val }); }} className="border rounded-lg p-2.5 flex-1 text-sm tabular" style={{ borderColor: 'var(--border)' }} />
                  <input type="password" placeholder="CVV" maxLength={3} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} className="border rounded-lg p-2.5 flex-1 text-sm tabular" style={{ borderColor: 'var(--border)' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-20 space-y-3">
          <OrderInvoice order={previewOrder} showDeliveryPending />

          {error && <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}

          <button
            onClick={handlePay}
            disabled={processing}
            className="text-white px-4 py-3 rounded-xl w-full font-semibold disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: 'var(--brand)' }}
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing payment...
              </>
            ) : `Pay ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
}