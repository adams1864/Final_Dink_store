import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/auth';
import { adminLogout } from '../../services/auth';
import {
  IconBrandProducthunt,
  IconDiscount2,
  IconFileInvoice,
  IconHomeBolt,
  IconMessageCircle,
  IconReorder,
  IconShoppingCart,
} from '@tabler/icons-react';

const menuItems = [
  {
    label: 'Dashboard',
    icon: IconHomeBolt,
    path: '/admin/dashboard',
  },
  {
    label: 'Products',
    icon: IconBrandProducthunt,
    path: '/admin/products',
  },
  {
    label: 'Orders',
    icon: IconReorder,
    path: '/admin/orders',
  },
  {
    label: 'Messages',
    icon: IconMessageCircle,
    path: '/admin/messages',
  },
  {
    label: 'Discounts',
    icon: IconDiscount2,
    path: '/admin/discounts',
  },
  {
    label: 'Invoices',
    icon: IconFileInvoice,
    path: '/admin/invoices',
  },
  {
    label: 'Leads',
    icon: IconShoppingCart,
    path: '/admin/leads',
  },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      // Skip check when on login page
      if (location.pathname === '/admin/login') {
        setChecking(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        if (cancelled) return;
        if (!data?.user) {
          navigate('/admin/login');
        }
      } catch (err) {
        if (!cancelled) navigate('/admin/login');
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    void check();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, navigate]);

  // If login route, render only the outlet (no header/sidebar)
  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div>
              <button
                onClick={async () => {
                  await adminLogout();
                  navigate('/admin/login');
                }}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md shadow-sm"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={18} stroke={1.4} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-lg shadow-sm p-8 min-h-[70vh]">
            {checking ? <div>Checking authentication...</div> : <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}
