import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { downloadInvoicePDF } from '../../utils/generateInvoicePdf';

export default function SellerInvoice() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await api.get(`/products/${id}/invoice`);
        setData(data);
      } catch (err) {
        setError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-10 text-center">Loading...</div>;
  if (error || !data) return <div className="max-w-2xl mx-auto px-4 py-10 text-center" style={{ color: 'var(--danger)' }}>{error}</div>;

  const { product, inspection } = data;
  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };
  const isPaid = inspection?.sellerPaid;
  const feeRefunded = inspection?.feeRefunded;

  const handleDownload = () => {
    downloadInvoicePDF({
      filename: `ExpiryMart-Invoice-${product.name.replace(/\s+/g, '-')}.pdf`,
      title: 'Seller Payout Invoice',
      meta: [
        `Product: ${product.name}`,
        `Date: ${new Date(product.createdAt).toLocaleDateString()}`,
      ],
      lines: [
        { label: 'MRP per unit', value: `Rs ${product.price}` },
        { label: 'Quantity', value: `${product.quantity}` },
        { label: 'Total MRP', value: `Rs ${product.totalMRP ?? product.price * product.quantity}` },
        { label: `Buying price (${inspection?.buyingPricePercent ?? '-'}% of Total MRP)`, value: `Rs ${product.totalBuyingPrice ?? '-'}` },
        { label: 'Distance charge deducted', value: `- Rs ${product.sellerDistanceCharge || 0}` },
        { label: 'Inspection fee (Rs 100)', value: feeRefunded ? 'Refunded' : 'Forfeited' },
      ],
      totals: [
        { label: 'Net amount received', value: `Rs ${product.sellerNetPayout ?? '-'}`, bold: true },
      ],
      footerNote: 'This is a system-generated invoice for demonstration purposes.',
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <Link to="/seller/history" className="text-sm font-medium mb-4 inline-block" style={{ color: 'var(--brand)' }}>← Back to history</Link>
      <h1 className="font-display text-xl font-bold mb-6">Invoice — {product.name}</h1>

      <div className="rounded-2xl p-5" style={cardStyle}>
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded-xl mb-4" />
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span style={{ color: 'var(--ink-muted)' }}>MRP per unit</span><span className="tabular">₹{product.price}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--ink-muted)' }}>Quantity</span><span>{product.quantity}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--ink-muted)' }}>Total MRP</span><span className="tabular">₹{product.totalMRP ?? product.price * product.quantity}</span></div>

          <div className="pt-2 mt-2" style={{ borderTop: '1px dashed var(--border)' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--ink-muted)' }}>Buying price ({inspection?.buyingPricePercent ?? '—'}% of Total MRP)</span>
              <span className="tabular">{product.totalBuyingPrice ? `₹${product.totalBuyingPrice}` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--ink-muted)' }}>Distance charge deducted</span>
              <span className="tabular" style={{ color: 'var(--danger)' }}>− ₹{product.sellerDistanceCharge || 0}</span>
            </div>
          </div>

          <div className="pt-2 mt-2" style={{ borderTop: '1px dashed var(--border)' }}>
            <div className="flex justify-between">
              <span style={{ color: 'var(--ink-muted)' }}>Inspection fee (₹100)</span>
              <span className="font-semibold" style={{ color: feeRefunded ? 'var(--brand)' : 'var(--danger)' }}>
                {inspection ? (feeRefunded ? 'Refunded to your account' : 'Forfeited') : 'Pending decision'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between font-display font-bold text-lg mt-4 pt-4 tabular" style={{ borderTop: '1px solid var(--border)' }}>
          <span>{isPaid ? 'Net amount received' : 'Expected net payout'}</span>
          <span style={{ color: 'var(--brand)' }}>₹{product.sellerNetPayout ?? '—'}</span>
        </div>

        {!isPaid && (
          <p className="text-xs mt-2" style={{ color: 'var(--ink-muted)' }}>Not yet paid out — awaiting agent pickup.</p>
        )}
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 px-4 py-2.5 rounded-xl font-semibold text-sm w-full"
        style={{ border: '1.5px solid var(--brand)', color: 'var(--brand)' }}
      >
        Download PDF
      </button>
    </div>
  );
}