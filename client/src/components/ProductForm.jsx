import { useState } from 'react';
import api from '../api/axios';

const methods = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
];

export default function ProductForm({ onProductAdded }) {
  const [form, setForm] = useState({
    name: '', category: 'FMCG', quantity: '', expiryDate: '', price: '',
  });
  const [images, setImages] = useState([]);
  const [feeMethod, setFeeMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalMRP = (Number(form.price) || 0) * (Number(form.quantity) || 0);

  const cardStyle = { borderColor: 'var(--border)' };
  const inputClass = "border rounded-lg p-2.5 w-full text-sm";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles]);
    e.target.value = ''; // allows re-selecting the same file later if removed
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const validateFeePayment = () => {
    if (feeMethod === 'upi') {
      if (!/^[\w.-]+@[\w]+$/.test(upiId)) return 'Enter a valid UPI ID, e.g. name@bank';
    }
    if (feeMethod === 'card') {
      if (card.number.replace(/\s/g, '').length !== 16) return 'Card number must be 16 digits';
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Expiry must be in MM/YY format';
      if (card.cvv.length !== 3) return 'CVV must be 3 digits';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const feeError = validateFeePayment();
    if (feeError) {
      setError(feeError);
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate fee payment processing

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('inspectionFeeMethod', feeMethod);
      images.forEach((file) => formData.append('images', file));

      const { data } = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onProductAdded(data);
      setForm({ name: '', category: 'FMCG', quantity: '', expiryDate: '', price: '' });
      setImages([]);
      setUpiId('');
      setCard({ number: '', expiry: '', cvv: '' });
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      {error && <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}

      <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} className={inputClass} style={cardStyle} required />

      <select name="category" value={form.category} onChange={handleChange} className={inputClass} style={cardStyle}>
        <option value="FMCG">FMCG</option>
        <option value="OTC Medicine">OTC Medicine</option>
      </select>

      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} className={inputClass} style={cardStyle} required />
      <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} className={inputClass} style={cardStyle} required />
      <input name="price" type="number" placeholder="MRP (₹)" value={form.price} onChange={handleChange} className={inputClass} style={cardStyle} required />

      {form.price && form.quantity && (
        <p className="text-xs" style={{ color: totalMRP < 200 ? 'var(--danger)' : 'var(--ink-muted)' }}>
          Total MRP: ₹{totalMRP} {totalMRP < 200 && '— minimum ₹200 required'}
        </p>
      )}

      <div>
        <label className="text-sm font-medium block mb-1">Product Images</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} className={inputClass} style={cardStyle} />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((file, i) => (
              <div key={i} className="relative w-16 h-16">
                <img src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded-lg" style={{ border: '1px solid var(--border)' }} />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-sm font-semibold mb-1">Inspection fee: ₹100 <span className="font-normal" style={{ color: 'var(--ink-muted)' }}>(refundable if approved)</span></p>

        <div className="flex gap-2 mb-3">
          {methods.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => setFeeMethod(m.id)}
              className="flex-1 py-2 rounded-lg text-sm font-medium border"
              style={{
                borderColor: feeMethod === m.id ? 'var(--brand)' : 'var(--border)',
                background: feeMethod === m.id ? 'var(--brand-light)' : 'transparent',
                color: feeMethod === m.id ? 'var(--brand)' : 'var(--ink)',
              }}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {feeMethod === 'upi' && (
          <input
            type="text"
            placeholder="yourname@bank"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className={inputClass}
            style={cardStyle}
          />
        )}

        {feeMethod === 'card' && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={card.number}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                setCard({ ...card, number: digits.replace(/(.{4})/g, '$1 ').trim() });
              }}
              className={`${inputClass} tabular`}
              style={cardStyle}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                maxLength={5}
                value={card.expiry}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
                  setCard({ ...card, expiry: val });
                }}
                className={`${inputClass} tabular`}
                style={cardStyle}
              />
              <input
                type="password"
                placeholder="CVV"
                maxLength={3}
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                className={`${inputClass} tabular`}
                style={cardStyle}
              />
            </div>
          </div>
        )}
      </div>
      <p className="text-xs" style={{ color: totalMRP > 0 && totalMRP < 200 ? 'var(--danger)' : 'var(--ink-muted)' }}>
        Minimum Total MRP required: ₹200{totalMRP > 0 && ` · Current: ₹${totalMRP}`}
      </p>
      <button type="submit" disabled={loading} className="text-white px-4 py-3 w-full rounded-xl font-semibold disabled:opacity-50" style={{ background: 'var(--brand)' }}>
        {loading ? 'Processing fee & adding...' : 'Pay ₹100 & Add Product'}
      </button>
    </form>
    
  );
}