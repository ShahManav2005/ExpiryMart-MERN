import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProductForm from '../../components/ProductForm';
import ProductTable from '../../components/ProductTable';
import EmptyState from '../../components/EmptyState';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/mine');
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Seller Dashboard</h1>
      <ProductForm onProductAdded={handleProductAdded} />
      <h3 className="font-bold text-sm text-gray-500 uppercase mb-2">Your Products</h3>
      {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : products.length === 0 ? (
        <EmptyState title="No products yet" subtitle="Add your first product above" />
      ) : (
        <ProductTable products={products} onDelete={handleDelete} />
      )}
</div>
  );
}