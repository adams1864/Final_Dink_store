import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  IconBrandProducthunt,
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
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
          <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
