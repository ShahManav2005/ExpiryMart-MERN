import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Logo from './Logo';
import Footer from './Footer';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to={user ? `/${user.role}/dashboard` : '/register'}>
            <Logo size={30} />
          </Link>

          <div className="flex items-center gap-5 text-sm">
            {user?.role === 'buyer' && (
              <Link to="/buyer/cart" className="relative font-medium" style={{ color: 'var(--ink)' }}>
                Cart
                {totalItems > 0 && (
                  <span
                    className="absolute -top-2 -right-3 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ background: 'var(--danger)' }}
                  >
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            {user?.role === 'buyer' && (
              <Link to="/buyer/orders" className="font-medium" style={{ color: 'var(--ink)' }}>Orders</Link>
            )}
            {user?.role === 'buyer' && (
              <Link to="/buyer/profile" className="font-medium" style={{ color: 'var(--ink)' }}>Profile</Link>
            )}

            {user?.role === 'agent' && (
              <Link to="/agent/profile" className="font-medium" style={{ color: 'var(--ink)' }}>Profile</Link>
            )}
            
            {user?.role === 'seller' && (
                <Link to="/seller/history" className="font-medium" style={{ color: 'var(--ink)' }}>History</Link>
              )}
              {user?.role === 'seller' && (
                <Link to="/seller/profile" className="font-medium" style={{ color: 'var(--ink)' }}>Profile</Link>
              )}

            {user && (
              <>
                <span className="hidden sm:inline" style={{ color: 'var(--ink-muted)' }}>{user.name}</span>
                <button onClick={handleLogout} className="font-medium" style={{ color: 'var(--ink-muted)' }}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}