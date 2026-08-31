import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const getExperience = (createdAt) => {
  const days = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return `${years} year${years !== 1 ? 's' : ''}${remMonths ? ` ${remMonths} mo` : ''}`;
};

export default function AgentProfile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ approved: 0, rejected: 0, totalEarned: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const [historyRes, earningsRes] = await Promise.all([
        api.get('/inspections/history'),
        api.get('/earnings/summary'),
      ]);
      const approved = historyRes.data.filter((i) => i.status === 'approved');
      const rejected = historyRes.data.filter((i) => i.status === 'rejected');
      setStats({ approved: approved.length, rejected: rejected.length, totalEarned: earningsRes.data.grandTotal });
    } finally {
      setLoadingStats(false);
    }
  };
  fetchStats();
}, []);

  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }

    setPwLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPwSuccess('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwLoading(false);
    }
  };

  const cardStyle = { background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="font-display text-xl font-bold mb-6">Agent Profile</h1>

      <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
        <h2 className="font-display font-semibold mb-3">Personal Details</h2>
        <div className="text-sm space-y-1.5">
          <p><span style={{ color: 'var(--ink-muted)' }}>Name:</span> <strong>{user?.name}</strong></p>
          <p><span style={{ color: 'var(--ink-muted)' }}>Email:</span> <strong>{user?.email}</strong></p>
          <p><span style={{ color: 'var(--ink-muted)' }}>Phone:</span> <strong>{user?.phone || '—'}</strong></p>
          <p><span style={{ color: 'var(--ink-muted)' }}>Role:</span> <strong className="capitalize">{user?.role}</strong></p>
          {user?.createdAt && (
            <p><span style={{ color: 'var(--ink-muted)' }}>Joined:</span> <strong>{new Date(user.createdAt).toLocaleDateString()}</strong> ({getExperience(user.createdAt)} with ExpiryMart)</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
        <h2 className="font-display font-semibold mb-3">Work Summary</h2>
        {loadingStats ? (
          <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl p-3" style={{ background: 'var(--brand-light)' }}>
              <p className="font-display font-bold text-lg" style={{ color: 'var(--brand)' }}>{stats.approved}</p>
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Approved</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: '#FEF2F2' }}>
              <p className="font-display font-bold text-lg" style={{ color: 'var(--danger)' }}>{stats.rejected}</p>
              <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Rejected</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: '#FFFBEB' }}>
                <p className="font-display font-bold text-lg" style={{ color: 'var(--accent)' }}>₹{stats.totalEarned}</p>
                <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>Total earned</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl p-5" style={cardStyle}>
        <h2 className="font-display font-semibold mb-3">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-3 max-w-sm">
          {pwError && <p className="text-sm" style={{ color: 'var(--danger)' }}>{pwError}</p>}
          {pwSuccess && <p className="text-sm" style={{ color: 'var(--brand)' }}>{pwSuccess}</p>}

          <input
            type="password" name="currentPassword" placeholder="Current password"
            value={passwords.currentPassword} onChange={handlePasswordChange}
            className="border rounded-lg p-2 w-full text-sm" style={{ borderColor: 'var(--border)' }} required
          />
          <input
            type="password" name="newPassword" placeholder="New password"
            value={passwords.newPassword} onChange={handlePasswordChange}
            className="border rounded-lg p-2 w-full text-sm" style={{ borderColor: 'var(--border)' }} required
          />
          <input
            type="password" name="confirmPassword" placeholder="Confirm new password"
            value={passwords.confirmPassword} onChange={handlePasswordChange}
            className="border rounded-lg p-2 w-full text-sm" style={{ borderColor: 'var(--border)' }} required
          />
          <button
            type="submit" disabled={pwLoading}
            className="text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background: 'var(--brand)' }}
          >
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}