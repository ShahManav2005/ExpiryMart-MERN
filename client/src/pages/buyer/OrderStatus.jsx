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
        const found = data.find((o) => o._id === id);
        setOrder(found);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!order) return <p className="text-center mt-10 text-red-500">Order not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 text-center">
      <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
      <p className="text-gray-600 mb-6">Order ID: {order._id}</p>

      <div className="border rounded p-4 text-left">
        <p className="font-bold mb-2">Status: <span className="text-blue-600">{order.orderStatus}</span></p>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <span>{item.productId?.name || 'Product'} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <Link to="/buyer/orders" className="text-blue-600 mt-4 block">View all orders</Link>
    </div>
  );
}