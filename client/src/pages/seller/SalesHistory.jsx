import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';

const statusVariant = {
  pending_inspection: 'warning',
  approved: 'info',
  listed: 'success',
  sold: 'info',
  rejected: 'danger',
};

const statusLabel = {
  pending_inspection: 'Under Inspection',
  approved: 'Awaiting Pickup',
  listed: 'Listed',
  sold: 'Sold',
  rejected: 'Rejected',
};

export default function SalesHistory() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get('/products/mine/summary');
        setData(data);
      } catch (err) {
        setError('Failed to load sales history');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10 text-center">Loading...</div>;
  if (error) return <div className="max-w-5xl mx-auto px-4 py-10 text-center" style={{ color: 'var(--danger)' }}>{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="font-display text-xl font-bold mb-6">Sales History</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="rounded-xl p-3 text-center" style={{ background: 'var(--brand-light)' }}>
          <p className="font-display font-bold text-lg" style={{ color: 'var(--brand)' }}>₹{data.totalEarned}</p>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Total earned</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={cardStyle}>
          <p className="font-display font-bold text-lg">{data.counts.listed}</p>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Listed</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={cardStyle}>
          <p className="font-display font-bold text-lg">{data.counts.sold}</p>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Sold</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={cardStyle}>
          <p className="font-display font-bold text-lg">{data.counts.pending}</p>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Under inspection</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={cardStyle}>
          <p className="font-display font-bold text-lg">{data.counts.rejected}</p>
          <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Rejected</p>
        </div>
      </div>

      {data.products.length === 0 ? (
        <EmptyState title="No products yet" subtitle="Add your first product to see it here" />
      ) : (
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--surface-muted)' }}>
              <tr className="text-left" style={{ color: 'var(--ink-muted)' }}>
                <th className="p-3 font-medium">Product</th>
                <th className="p-3 font-medium">Total MRP</th>
                <th className="p-3 font-medium">You earned</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Listed on</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((p) => (
                <tr key={p._id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 tabular">₹{p.totalMRP ?? (p.price * p.quantity)}</td>
                  <td className="p-3 tabular">{p.sellerNetPayout ? `₹${p.sellerNetPayout}` : '—'}</td>
                  <td className="p-3"><Badge variant={statusVariant[p.status]}>{statusLabel[p.status]}</Badge></td>
                  <td className="p-3" style={{ color: 'var(--ink-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl p-3 text-center" style={cardStyle}>
        <p className="font-display font-bold text-lg">{data.counts.awaitingPickup}</p>
        <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Awaiting pickup</p>
      </div>
    </div>
  );
}