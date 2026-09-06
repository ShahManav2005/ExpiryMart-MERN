import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import OrderInvoice from '../../components/OrderInvoice';

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

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-10 text-center">Loading...</div>;
  if (!order) return <div className="max-w-2xl mx-auto px-4 py-10 text-center" style={{ color: 'var(--danger)' }}>Order not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl" style={{ background: 'var(--brand-light)' }}>✓</div>
        <h1 className="font-display text-2xl font-bold mb-1">Order Placed!</h1>
        <p className="font-semibold" style={{ color: 'var(--brand)' }}>Status: <span className="capitalize">{order.orderStatus}</span></p>
      </div>

      {order.deliveryStatus === 'delivered' && (
        <div className="rounded-xl p-3 mb-4 text-sm" style={{ background: 'var(--brand-light)', color: 'var(--brand-dark)' }}>
          Delivered! {order.deliveryCharge > 0 ? `A ₹${order.deliveryCharge} delivery charge was applied based on distance from our warehouse.` : 'No delivery charge applied — you were within free delivery range.'}
        </div>
      )}

      <OrderInvoice order={order} showDeliveryPending />

      <Link to="/buyer/orders" className="mt-4 block text-center font-semibold" style={{ color: 'var(--brand)' }}>View all orders</Link>
    </div>
  );
}