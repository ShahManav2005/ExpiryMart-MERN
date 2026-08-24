export default function ProductCard({ product }) {
  const daysLeft = Math.ceil((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="border rounded p-3">
      {product.images?.[0] && (
        <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
      )}
      <h3 className="font-bold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.category}</p>
      <p className="text-sm">₹{product.price}</p>
      <p className="text-sm">Available Quantity : {product.quantity}</p>
      <p className="text-xs text-gray-500">{daysLeft} days left</p>
    </div>
  );
}