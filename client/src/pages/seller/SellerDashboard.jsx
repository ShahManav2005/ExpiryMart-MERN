import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SellerTerms from '../../components/SellerTerms';

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="font-display text-xl font-bold mb-1">Welcome, {user?.name}</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>
        List your near-expiry products and turn them into cash instead of waste.
      </p>

      <SellerTerms />

      <Link
        to="/seller/add-product"
        className="text-white px-6 py-3 rounded-xl font-semibold inline-block"
        style={{ background: 'var(--brand)' }}
      >
        + Add Product
      </Link>
    </div>
  );
}