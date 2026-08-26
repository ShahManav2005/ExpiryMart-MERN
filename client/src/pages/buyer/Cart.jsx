import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10 px-4 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/buyer/dashboard" className="text-blue-600">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {items.map((item) => (
        <div key={item.productId} className="flex items-center gap-4 border-b py-3">
          {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
          <div className="flex-1">
            <p className="font-bold">{item.name}</p>
            <p className="text-sm text-gray-600">₹{item.price} each</p>
          </div>
          <input
            type="number"
            min="1"
            max={item.maxQuantity}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
            className="border w-16 p-1 text-center"
          />
          <p className="w-20 text-right">₹{item.price * item.quantity}</p>
          <button onClick={() => removeFromCart(item.productId)} className="text-red-600 text-sm">
            Remove
          </button>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6 font-bold text-lg">
        <span>Total</span>
        <span>₹{totalAmount}</span>
      </div>

      <Link
        to="/buyer/checkout"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-4 block text-center"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}