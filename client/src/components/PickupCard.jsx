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

export default function PickupCard({ inspection, onUpdated }) {
  const product = inspection.productId;
  const seller = product?.sellerId;
  const [pickupDate, setPickupDate] = useState(inspection.pickupDate ? inspection.pickupDate.slice(0, 10) : '');
  const [distanceKm, setDistanceKm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };
  const preview = previewCharge(distanceKm);

  const handleSaveDate = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.put(`/inspections/${inspection._id}/logistics`, { pickupDate });
      onUpdated(data, null);
    } catch (err) {
      setError('Failed to schedule pickup');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    setError('');
    if (!distanceKm) {
      setError('Enter distance from warehouse to complete pickup');
      return;
    }
    if (preview?.rejected) {
      setError(`Distance exceeds the 8.75km limit — this pickup cannot be completed.`);
      return;
    }
    setLoading(true);
    try {
      await api.put(`/inspections/${inspection._id}/logistics`, { sellerPaid: true, distanceKm });
      onUpdated(null, inspection._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as paid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
      <div className="flex gap-4">
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold">{product.name}</h3>
          {seller && (
            <p className="text-sm mt-1" style={{ color: 'var(--ink-muted)' }}>
              Pickup from: <strong style={{ color: 'var(--ink)' }}>{seller.name}</strong>
              {seller.address && ` · ${seller.address}`}
              {seller.phone && ` · ${seller.phone}`}
            </p>
          )}
          <p className="text-sm mt-2 font-semibold" style={{ color: 'var(--accent)' }}>
            {product.totalBuyingPrice ? `Base amount for seller: ₹${product.totalBuyingPrice}` : (
              <span style={{ color: 'var(--danger)' }}>⚠ Pricing data missing for this product</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 mt-3">
        <div>
          <label className="text-sm font-medium block mb-1">Pickup date</label>
          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="border rounded-lg p-2 text-sm" style={{ borderColor: 'var(--border)' }} />
        </div>
        <button onClick={handleSaveDate} disabled={loading || !pickupDate} className="px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ border: '1.5px solid var(--brand)', color: 'var(--brand)' }}>
          Save date
        </button>
      </div>

      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-sm font-semibold mb-2">Complete pickup & pay seller</p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-sm font-medium block mb-1">Distance from warehouse (km)</label>
            <input type="number" step="0.01" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="e.g. 6" className="border rounded-lg p-2 text-sm w-32" style={{ borderColor: 'var(--border)' }} />
          </div>
          {preview && !preview.rejected && (
            <div className="text-sm">
              <p style={{ color: 'var(--ink-muted)' }}>
                {preview.charge > 0 ? `Distance charge: ₹${preview.charge}` : 'Free (within 3.75km)'} · Seller receives: <strong style={{ color: 'var(--ink)' }}>₹{product.totalBuyingPrice - preview.charge}</strong>
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
          <button onClick={handleMarkPaid} disabled={loading || preview?.rejected} className="text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 ml-auto" style={{ background: 'var(--brand)' }}>
            Mark paid to seller
          </button>
        </div>
      </div>

      {error && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}