import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import ProductFilters from '../../components/ProductFilters';
import BuyerHero from '../../components/BuyerHero';
import { CardSkeletonGrid } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', maxDaysToExpiry: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => { if (value) params[key] = value; });
      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BuyerHero />

      <div id="browse">
        <h2 className="font-display text-xl font-bold mb-4">Today's deals</h2>
        <ProductFilters filters={filters} onChange={setFilters} />

        {loading ? (
          <CardSkeletonGrid />
        ) : error ? (
          <p style={{ color: 'var(--danger)' }}>{error}</p>
        ) : products.length === 0 ? (
          <EmptyState title="No products match your filters" subtitle="Try widening your search" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </div>
  );
}