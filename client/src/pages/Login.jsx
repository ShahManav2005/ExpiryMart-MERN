import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border rounded-lg p-3 w-full text-sm";
  const inputStyle = { borderColor: 'var(--border)' };

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-muted)' }}>Log in to your ExpiryMart account</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}

        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputClass} style={inputStyle} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputClass} style={inputStyle} required />

        <button type="submit" disabled={loading} className="text-white px-4 py-3 rounded-xl w-full font-semibold disabled:opacity-50" style={{ background: 'var(--brand)' }}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="text-sm text-center mt-6" style={{ color: 'var(--ink-muted)' }}>
        Don't have an account? <Link to="/register" className="font-semibold" style={{ color: 'var(--brand)' }}>Register</Link>
      </p>
    </AuthLayout>
  );
}