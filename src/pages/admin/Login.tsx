import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, getCurrentUser } from '../../services/auth';
import { brandLogo } from '../../assets';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!email || !password) {
        setError('Please enter email and password');
        return;
      }

      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const data = await getCurrentUser();
        if (cancelled) return;
        if (data?.user?.role === 'admin') navigate('/admin/dashboard');
      } catch (_err) {
        // ignore
      }
    }
    void check();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-rose-50 flex items-center justify-center">
      <div className="w-full max-w-xl mx-4 grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden relative">
        {/* Top-left floating logo */}
        <div className="absolute -top-10 -left-10 z-20">
          <div className="bg-white rounded-full p-4 shadow-2xl ring-2 ring-red-50">
            <img src={brandLogo} alt="logo" className="w-20 h-20 object-contain rounded-full" />
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center bg-red-600 text-white pt-14 pb-8 px-8">
          <h2 className="text-2xl font-bold mt-2">Admin Dashboard</h2>
          <p className="mt-4 text-sm text-red-100">Manage products, orders and view sales reports.</p>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-semibold mb-2">Sign in to your admin account</h3>
          <p className="text-sm text-gray-500 mb-6">Enter your admin credentials to continue.</p>

          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="admin@example.com"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Forgot password? Contact the owner.</div>
              <button
                type="submit"
                className="ml-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-xs text-gray-400">Admin access only. Unauthorized use is prohibited.</div>
        </div>
      </div>
    </div>
  );
}
