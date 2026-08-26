import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../api/axios';
import ProductCard from '../../components/ProductCard';
import ProductFilters from '../../components/ProductFilter';

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '', category: '', minPrice: '', maxPrice: '', maxDaysToExpiry: '',
  });
  const {totalItems} = useCart()

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 400); // debounce so typing doesn't fire a request per keystroke
    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Browse Products</h1>
      <Link to='/buyer/cart' className='text-blue-600'>Cart ({totalItems})</Link>

      <ProductFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}