import Badge from './Badge';

const statusVariant = {
  pending_inspection: 'warning',
  listed: 'success',
  rejected: 'danger',
  sold: 'neutral',
};

const statusLabel = {
  pending_inspection: 'Pending Inspection',
  listed: 'Listed',
  rejected: 'Rejected',
  sold: 'Sold',
};

export default function ProductTable({ products, onDelete }) {
  if (products.length === 0) return null; // EmptyState handled by parent

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Qty</th>
            <th className="p-3 text-left">MRP</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((p) => (
            <tr key={p._id}>
              <td className="p-3 font-medium">{p.name}</td>
              <td className="p-3 text-gray-500">{p.category}</td>
              <td className="p-3">{p.quantity}</td>
              <td className="p-3">₹{p.price}</td>
              <td className="p-3"><Badge variant={statusVariant[p.status]}>{statusLabel[p.status]}</Badge></td>
              <td className="p-3">
                <button onClick={() => onDelete(p._id)} className="text-red-600 hover:underline text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}