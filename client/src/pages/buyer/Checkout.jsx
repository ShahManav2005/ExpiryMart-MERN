import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', { items: orderItems });
      clearCart();
      navigate(`/buyer/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {items.map((item) => (
        <div key={item.productId} className="flex justify-between border-b py-2">
          <span>{item.name} x {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <div className="flex justify-between font-bold text-lg mt-4">
        <span>Total</span>
        <span>₹{totalAmount}</span>
      </div>

      <div className="border rounded p-3 mt-4 bg-gray-50">
        <p className="text-sm text-gray-600">Payment method: Mock Payment (no real transaction)</p>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4 disabled:opacity-50"
      >
        {loading ? 'Placing order...' : 'Place Order'}
      </button>
    </div>
  );
}