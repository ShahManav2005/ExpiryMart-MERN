import { useState } from 'react';
import api from '../api/axios';

const previewCharge = (km) => {
  const d = Number(km);
  if (!d || d <= 0) return null;
  if (d > 8.75) return { charge: 0, rejected: true };
  if (d >= 5.01) return { charge: 20, rejected: false };
  if (d >= 3.76) return { charge: 10, rejected: false };
  return { charge: 0, rejected: false };
};

export default function DeliveryCard({ order, onDelivered }) {
  const buyer = order.buyerId;
  const [distanceKm, setDistanceKm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };
  const preview = previewCharge(distanceKm);

  const handleDeliver = async () => {
    setError('');
    if (!distanceKm) {
      setError('Enter distance from warehouse to complete delivery');
      return;
    }
    if (preview?.rejected) {
      setError('Distance exceeds the 8.75km limit — this delivery cannot be completed.');
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
          <input type="number" step="0.01" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="e.g. 4" className="border rounded-lg p-2 text-sm w-32" style={{ borderColor: 'var(--border)' }} />
        </div>
        {preview && !preview.rejected && (
          <div className="text-sm">
            <p style={{ color: 'var(--ink-muted)' }}>
              {preview.charge > 0 ? `Buyer delivery charge: ₹${preview.charge}` : 'Free delivery (within 3.75km)'}
            </p>
            <p style={{ color: 'var(--brand)' }}>
              You'll earn ₹{30 + preview.charge} for this pickup (₹30 base{preview.charge > 0 ? ` + ₹${preview.charge} distance charge` : ''})
            </p>
          </div>
        )}
        {preview?.rejected && (
          <p className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>
            Exceeds 8.75km limit — cannot be completed
          </p>
        )}
        <button onClick={handleDeliver} disabled={loading || preview?.rejected} className="text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 ml-auto" style={{ background: 'var(--brand)' }}>
          Mark delivered
        </button>
      </div>

      {error && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}