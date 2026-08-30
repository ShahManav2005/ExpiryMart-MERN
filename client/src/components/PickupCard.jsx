import { useState } from 'react';
import api from '../api/axios';

export default function PickupCard({ inspection, onUpdated }) {
  const product = inspection.productId;
  const seller = product?.sellerId;
  const [pickupDate, setPickupDate] = useState(inspection.pickupDate ? inspection.pickupDate.slice(0, 10) : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };

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
    setLoading(true);
    try {
      await api.put(`/inspections/${inspection._id}/logistics`, { sellerPaid: true });
      onUpdated(null, inspection._id);
    } catch (err) {
      setError('Failed to mark as paid');
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
            Amount to pay seller: ₹{product.buyingPrice}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 mt-3">
        <div>
          <label className="text-sm font-medium block mb-1">Pickup date</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="border rounded-lg p-2 text-sm"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <button onClick={handleSaveDate} disabled={loading || !pickupDate} className="px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ border: '1.5px solid var(--brand)', color: 'var(--brand)' }}>
          Save date
        </button>
        <button onClick={handleMarkPaid} disabled={loading} className="text-white px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 ml-auto" style={{ background: 'var(--brand)' }}>
          Mark paid to seller
        </button>
      </div>

      {error && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}