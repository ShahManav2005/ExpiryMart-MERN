import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'buyer', phone: '', shopName: '', address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border rounded-lg p-3 w-full text-sm";
  const inputStyle = { borderColor: 'var(--border)' };

  return (
    <AuthLayout tagline="Join a marketplace that turns near-expiry stock into real savings">
      <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>Buy, sell, or inspect — pick your role below</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}

        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} className={inputClass} style={inputStyle} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} style={inputStyle} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputClass} style={inputStyle} required />

        <select name="role" value={form.role} onChange={handleChange} className={inputClass} style={inputStyle}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="agent">Agent</option>
        </select>

        {form.role === 'seller' && (
          <input name="shopName" placeholder="Shop name" value={form.shopName} onChange={handleChange} className={inputClass} style={inputStyle} />
        )}

        {(form.role === 'seller' || form.role === 'buyer') && (
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className={inputClass} style={inputStyle} required />
        )}

        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className={inputClass} style={inputStyle} />

        <button type="submit" disabled={loading} className="text-white px-4 py-3 rounded-xl w-full font-semibold disabled:opacity-50" style={{ background: 'var(--brand)' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-center mt-6" style={{ color: 'var(--ink-muted)' }}>
        Already have an account? <Link to="/login" className="font-semibold" style={{ color: 'var(--brand)' }}>Log in</Link>
      </p>
    </AuthLayout>
  );
}