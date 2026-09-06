import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';

export default function AddProduct() {
  const navigate = useNavigate();

  const handleProductAdded = () => {
    navigate('/seller/history');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-display text-xl font-bold mb-6">Add Product</h1>
      <ProductForm onProductAdded={handleProductAdded} />
    </div>
  );
}