import { useState } from 'react';
import api from '../api/axios';

export default function ProductForm({ onProductAdded }) {
  const [form, setForm] = useState({
    name: '', category: 'FMCG', quantity: '', expiryDate: '', price: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach((file) => formData.append('images', file));

      const { data } = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onProductAdded(data);
      setForm({ name: '', category: 'FMCG', quantity: '', expiryDate: '', price: '' });
      setImages([]);
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded mb-6 space-y-3 max-w-md">
      <h3 className="font-bold text-lg">Add Product</h3>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} className="border p-2 w-full" required />

      <select name="category" value={form.category} onChange={handleChange} className="border p-2 w-full">
        <option value="FMCG">FMCG</option>
        <option value="OTC Medicine">OTC Medicine</option>
      </select>

      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="border p-2 w-full" required />
      <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} className="border p-2 w-full" required />
      <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} className="border p-2 w-full" required />

      <input type="file" multiple accept="image/*" onChange={handleImageChange} className="border p-2 w-full" />

      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 w-full disabled:opacity-50">
        {loading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}