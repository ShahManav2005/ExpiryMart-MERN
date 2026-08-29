// pages/buyer/OrderStatus.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function OrderStatus() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get('/orders/mine');
        setOrder(data.find((o) => o._id === id));
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="<div className='max-w-7xl px-4 sm:px-6 lg:px-8 text-center">Loading...</div>;
  if (!order) return <div className="<div className='max-w-7xl px-4 sm:px-6 lg:px-8 text-center" style={{ color: 'var(--danger)' }}>Order not found</div>;

  return (
    <div className="<div className='max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl" style={{ background: 'var(--brand-light)' }}>✓</div>
      <h1 className="font-display text-2xl font-bold mb-1">Order placed!</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>Order ID: {order._id}</p>

      <div className="rounded-2xl p-4 text-left" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <p className="font-semibold mb-2">Status: <span style={{ color: 'var(--brand)' }}>{order.orderStatus}</span></p>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between py-2 text-sm tabular" style={{ borderBottom: '1px solid var(--border)' }}>
            <span>{item.productId?.name || 'Product'} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2 tabular">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <Link to="/buyer/orders" className="mt-4 inline-block font-semibold" style={{ color: 'var(--brand)' }}>View all orders</Link>
    </div>
  );
}