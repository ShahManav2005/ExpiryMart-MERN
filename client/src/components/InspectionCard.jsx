import { useState } from 'react';
import api from '../api/axios';

export default function InspectionCard({ inspection, onDecided }) {
  const product = inspection.productId;
  const [buyingPrice, setBuyingPrice] = useState(inspection.recommendation?.buyingPrice || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const handleDecision = async (decision) => {
    setError('');
    setLoading(true);
    try {
      const payload = { decision };
      if (decision === 'approve') payload.buyingPrice = Number(buyingPrice);

      await api.put(`/inspections/${inspection._id}/decision`, payload);
      onDecided(inspection._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Decision failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 mb-4">
      <div className="flex gap-4">
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded" />
        )}
        <div className="flex-1">
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
          <p className="text-sm">MRP: ₹{product.price} | Qty: {product.quantity}</p>
          <p className="text-sm">Expiry: {new Date(product.expiryDate).toLocaleDateString()}</p>
          <p className="text-sm text-blue-600 mt-1">
            Recommended buying price: ₹{inspection.recommendation?.buyingPrice} ({inspection.recommendation?.percent}% of MRP)
          </p>
        </div>
      </div>

      <div className="mt-2">
        <label className="text-sm text-gray-600">Confirm/override buying price:</label>
        <input
          type="number"
          value={buyingPrice}
          onChange={(e) => setBuyingPrice(e.target.value)}
          className="border p-1 w-24 ml-2"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="flex gap-2 mt-3">
        <button onClick={() => handleDecision('approve')} disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50">
          Approve
        </button>
        <button onClick={() => handleDecision('reject')} disabled={loading} className="bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50">
          Reject
        </button>
      </div>
    </div>
  );
}