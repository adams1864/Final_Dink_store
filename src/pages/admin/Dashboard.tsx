import { useEffect, useState } from 'react';
import {
  IconBrandProducthunt,
  IconReorder,
  IconShoppingCart,
  IconCurrencyDollar,
} from '@tabler/icons-react';
import { getMeta, getOrders, type Order } from '../../services/api';

type DashboardCounts = {
  products: number;
  orders: number;
  leads: number;
  revenue: number;
};

const DEFAULT_COUNTS: DashboardCounts = {
  products: 0,
  orders: 0,
  leads: 0,
  revenue: 0,
};

type StatConfig = {
  key: keyof DashboardCounts;
  title: string;
  icon: any;
  color: string;
  format?: (value: number) => string;
};

const STAT_CONFIG: StatConfig[] = [
  {
    key: 'products',
    title: 'Total Products',
    icon: IconBrandProducthunt,
    color: 'blue',
  },
  {
    key: 'orders',
    title: 'Total Orders',
    icon: IconReorder,
    color: 'green',
  },
  {
    key: 'leads',
    title: 'Total Leads',
    icon: IconShoppingCart,
    color: 'orange',
  },
  {
    key: 'revenue',
    title: 'Total Revenue',
    icon: IconCurrencyDollar,
    color: 'teal',
    format: (value) => `ETB ${value.toLocaleString()}`,
  },
];

const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', badge: 'bg-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', badge: 'bg-green-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', badge: 'bg-orange-600' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', badge: 'bg-teal-600' },
};

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-blue-100 text-blue-800',
  processing: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Dashboard() {
  const [counts, setCounts] = useState<DashboardCounts>(DEFAULT_COUNTS);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const [summary, orders] = await Promise.all([
          getMeta(),
          getOrders().catch(() => []),
        ]);

        if (cancelled) return;

        setCounts({
          products: summary.products,
          orders: summary.orders,
          leads: summary.leads || 0,
          revenue: summary.revenue,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CONFIG.map((config) => {
          const Icon = config.icon;
          const rawValue = counts[config.key];
          const formattedValue = config.format
            ? config.format(rawValue)
            : rawValue.toLocaleString();
          const colors = colorMap[config.color];

          return (
            <div
              key={config.key}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {config.title}
                  </p>
                  {loading ? (
                    <div className="h-7 w-20 bg-gray-200 animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-2xl font-bold mt-2">{formattedValue}</p>
                  )}
                </div>
                <div className={`${colors.bg} p-3 rounded-lg`}>
                  <Icon size={24} stroke={1.5} className={colors.icon} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            statusColors[order.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ETB {order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
