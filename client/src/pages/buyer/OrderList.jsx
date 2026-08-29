import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import EmptyState from '../../components/EmptyState';

const statusColor = {
  placed: 'var(--accent)',
  confirmed: 'var(--brand)',
  delivered: 'var(--brand-dark)',
  cancelled: 'var(--danger)',
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/mine');
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-10 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-display text-xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/buyer/orders/${order._id}`}
              className="block rounded-2xl p-4"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                  {new Date(order.createdAt).toLocaleDateString()} · #{order._id.slice(-6)}
                </p>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full text-white capitalize"
                  style={{ background: statusColor[order.orderStatus] || 'var(--ink-muted)' }}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="text-sm space-y-0.5 mb-2">
                {order.items.map((item, i) => (
                  <p key={i} style={{ color: 'var(--ink-muted)' }}>
                    {item.productId?.name || 'Product'} × {item.quantity}
                  </p>
                ))}
              </div>

              <p className="font-display font-bold tabular">₹{order.totalAmount}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}