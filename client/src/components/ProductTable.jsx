import { statusStyles, statusLabel } from '../utils/statusBadge';

export default function ProductTable({ products, onDelete }) {
  if (products.length === 0) {
    return <p className="text-gray-500">No products listed yet. Add your first one above.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b text-left">
          <th className="p-2">Name</th>
          <th className="p-2">Category</th>
          <th className="p-2">Qty</th>
          <th className="p-2">Price</th>
          <th className="p-2">Expiry</th>
          <th className="p-2">Status</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id} className="border-b">
            <td className="p-2">{p.name}</td>
            <td className="p-2">{p.category}</td>
            <td className="p-2">{p.quantity}</td>
            <td className="p-2">₹{p.price}</td>
            <td className="p-2">{new Date(p.expiryDate).toLocaleDateString()}</td>
            <td className="p-2">
              <span className={`px-2 py-1 rounded text-xs ${statusStyles[p.status]}`}>
                {statusLabel[p.status]}
              </span>
            </td>
            <td className="p-2">
              <button onClick={() => onDelete(p._id)} className="text-red-600 text-sm">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}