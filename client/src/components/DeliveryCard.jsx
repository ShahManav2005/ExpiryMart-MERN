import { useState } from 'react';
import api from '../api/axios';

const estimateEarning = (km) => {
  const d = Number(km);
  if (!d || d <= 0) return 0;
  return d <= 5 ? 15 : 15 + (d - 5) * 3;
};

export default function DeliveryCard({ order, onDelivered }) {
  const buyer = order.buyerId;
  const [distanceKm, setDistanceKm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };

  const handleDeliver = async () => {
    setError('');
    if (!distanceKm) {
      setError('Enter distance travelled from the warehouse to log your delivery earning');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/orders/${order._id}/deliver`, { distanceKm });
      onDelivered(order._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <div>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Order #{order._id.slice(-6)} · {new Date(order.createdAt).toLocaleDateString()}</p>
          {buyer && (
            <p className="text-sm mt-1">
              Deliver to: <strong>{buyer.name}</strong>{buyer.address && ` · ${buyer.address}`}{buyer.phone && ` · ${buyer.phone}`}
            </p>
          )}
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white shrink-0 capitalize" style={{ background: 'var(--accent)' }}>
          {order.deliveryStatus}
        </span>
      </div>

      <div className="text-sm space-y-0.5 mb-3">
        {order.items.map((item, i) => (
          <p key={i} style={{ color: 'var(--ink-muted)' }}>{item.productId?.name || 'Product'} × {item.quantity}</p>
        ))}
      </div>
      <p className="font-display font-bold tabular mb-3">Order total: ₹{order.totalAmount}</p>

      <div className="flex flex-wrap items-end gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div>
          <label className="text-sm font-medium block mb-1">Distance from warehouse (km)</label>
          <input
            type="number"
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            placeholder="e.g. 4.2"
            className="border rounded-lg p-2 text-sm w-32"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        {distanceKm > 0 && (
          <p className="text-sm" style={{ color: 'var(--brand)' }}>
            You'll earn ₹{estimateEarning(distanceKm).toFixed(0)} for this delivery
          </p>
        )}
        <button onClick={handleDeliver} disabled={loading} className="text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 ml-auto" style={{ background: 'var(--brand)' }}>
          Mark delivered
        </button>
      </div>

      {error && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}