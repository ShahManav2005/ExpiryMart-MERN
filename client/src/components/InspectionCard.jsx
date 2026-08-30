import { useState } from 'react';
import api from '../api/axios';

export default function InspectionCard({ inspection, onDecided }) {
  const product = inspection.productId;
  const seller = product?.sellerId;
  const [buyingPrice, setBuyingPrice] = useState(inspection.recommendation?.buyingPrice || '');
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };

  const handleApprove = async () => {
    setError('');
    setLoading(true);
    try {
      await api.put(`/inspections/${inspection._id}/decision`, {
        decision: 'approve',
        buyingPrice: Number(buyingPrice),
      });
      onDecided(inspection._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Decision failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = () => {
    setShowRejectBox(true);
  };

  const confirmReject = async () => {
    if (!rejectNote.trim()) {
      setError('Please explain why you are rejecting this product');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.put(`/inspections/${inspection._id}/decision`, {
        decision: 'reject',
        notes: rejectNote,
      });
      onDecided(inspection._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Decision failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
      <div className="flex gap-4">
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-xl shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold">{product.name}</h3>
          <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: 'var(--ink-muted)' }}>{product.category}</p>
          <p className="text-sm mt-1">MRP: <strong>₹{product.price}</strong> · Qty: <strong>{product.quantity}</strong></p>
          <p className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            Expiry: <span style={{ color: 'var(--danger)' }}>{new Date(product.expiryDate).toLocaleDateString()}</span>
          </p>
          {seller && (
            <p className="text-xs mt-1" style={{ color: 'var(--ink-muted)' }}>
              Seller: {seller.name}{seller.phone && ` · ${seller.phone}`}
            </p>
          )}
          <p className="text-sm font-semibold mt-2" style={{ color: 'var(--brand)' }}>
            Recommended buying price: ₹{inspection.recommendation?.buyingPrice} ({inspection.recommendation?.percent}% of MRP)
          </p>
        </div>
      </div>

      {!showRejectBox && (
        <div className="mt-3">
          <label className="text-sm font-medium block mb-1">Confirm/override buying price</label>
          <input
            type="number"
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.target.value)}
            className="border rounded-lg p-2 w-32 text-sm"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
      )}

      {showRejectBox && (
        <div className="mt-3">
          <label className="text-sm font-medium block mb-1">Reason for rejection</label>
          <textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="e.g. Packaging damaged, expiry too close, product mismatch..."
            rows={3}
            className="border rounded-lg p-2 w-full text-sm"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
      )}

      {error && <p className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{error}</p>}

      <div className="flex gap-2 mt-4">
        {!showRejectBox ? (
          <>
            <button onClick={handleApprove} disabled={loading} className="text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ background: 'var(--brand)' }}>
              Approve
            </button>
            <button onClick={handleRejectClick} disabled={loading} className="text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ background: 'var(--danger)' }}>
              Reject
            </button>
          </>
        ) : (
          <>
            <button onClick={confirmReject} disabled={loading} className="text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50" style={{ background: 'var(--danger)' }}>
              Confirm Rejection
            </button>
            <button onClick={() => { setShowRejectBox(false); setError(''); }} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ border: '1px solid var(--border)', color: 'var(--ink-muted)' }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}