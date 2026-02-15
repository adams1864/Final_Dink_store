import { useEffect, useMemo, useState } from 'react';
import {
  IconAlertTriangle,
  IconChartAreaLine,
  IconCircleCheck,
  IconClockHour4,
  IconCurrencyDollar,
  IconShoppingBag,
} from '@tabler/icons-react';
import {
  getSalesStatusCounts,
  getSalesSummary,
  getSalesTopProducts,
  getSalesTrends,
  getMessages,
  getWebSocketUrl,
  type MessageRecord,
  type SalesStatusCount,
  type SalesSummary,
  type SalesTopProduct,
  type SalesTrendPoint,
} from '../../services/api';

const RANGE_OPTIONS = [7, 30, 90];

function formatCurrency(value: number) {
  return `ETB ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function Sparkline({ points }: { points: number[] }) {
  const width = 520;
  const height = 140;

  if (!points.length) {
    return <div className="h-[140px] flex items-center justify-center text-gray-500 text-base">No data yet</div>;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const coords = points.map((value, idx) => {
    const x = points.length === 1 ? width : (idx / (points.length - 1)) * width;
    const y = height - ((value - min) / span) * height;
    return { x, y };
  });

  const polyPoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const areaPoints = `0,${height} ${polyPoints} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="presentation">
      <defs>
        <linearGradient id="spark-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
          <stop offset="100%" stopColor="rgba(59,130,246,0.02)" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#spark-gradient)" />
      <polyline
        points={polyPoints}
        fill="none"
        stroke="rgb(59,130,246)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Dashboard() {
  const [rangeDays, setRangeDays] = useState(30);
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [trends, setTrends] = useState<SalesTrendPoint[]>([]);
  const [topProducts, setTopProducts] = useState<SalesTopProduct[]>([]);
  const [statusCounts, setStatusCounts] = useState<SalesStatusCount[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [summaryRes, trendsRes, topProductsRes, statusesRes] = await Promise.all([
          getSalesSummary(rangeDays),
          getSalesTrends(rangeDays),
          getSalesTopProducts(rangeDays, 5),
          getSalesStatusCounts(rangeDays),
        ]);

        if (cancelled) return;

        setSummary(summaryRes);
        setTrends(trendsRes.points || []);
        setTopProducts(topProductsRes.products || []);
        setStatusCounts(statusesRes.statuses || []);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [rangeDays]);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      try {
        setMessagesLoading(true);
        setMessagesError(null);
        const data = await getMessages(8);
        if (!cancelled) {
          setMessages(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setMessagesError(err?.message || 'Failed to load messages');
        }
      } finally {
        if (!cancelled) {
          setMessagesLoading(false);
        }
      }
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const wsUrl = getWebSocketUrl();
    if (!wsUrl) return;

    const socket = new WebSocket(wsUrl);
    socket.onopen = () => setWsConnected(true);
    socket.onclose = () => setWsConnected(false);
    socket.onerror = () => setWsConnected(false);
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type === 'new_message' && payload?.data) {
          setMessages((prev) => [payload.data as MessageRecord, ...prev].slice(0, 12));
        }
      } catch (_) {
        // ignore malformed messages
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const statusMap = useMemo(() => {
    const map: Record<string, number> = {};
    statusCounts.forEach((item) => {
      map[item.status] = item.count;
    });
    return map;
  }, [statusCounts]);

  const revenueSeries = useMemo(() => trends.map((point) => point.revenue), [trends]);

  const cards = [
    {
      title: 'Revenue',
      value: summary ? formatCurrency(summary.revenue) : '—',
      subtitle: summary ? `Avg order ${formatCurrency(summary.averageOrderValue)}` : 'Loading...',
      icon: IconCurrencyDollar,
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Orders',
      value: summary ? formatNumber(summary.orders) : '—',
      subtitle: summary ? `Paid ${summary.paidCount} • Completed ${summary.completedCount}` : 'Loading...',
      icon: IconShoppingBag,
      accent: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Pending value',
      value: summary ? formatCurrency(summary.pendingValue) : '—',
      subtitle: summary ? `${summary.pendingCount} pending orders` : 'Loading...',
      icon: IconClockHour4,
      accent: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Cancelled',
      value: summary ? formatNumber(summary.cancelledCount) : '—',
      subtitle: 'In selected range',
      icon: IconAlertTriangle,
      accent: 'bg-rose-50 text-rose-700',
    },
  ];

  const statusBadges = [
    { key: 'pending', label: 'Pending', color: 'bg-amber-50 text-amber-700 border border-amber-100' },
    { key: 'paid', label: 'Paid', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
    { key: 'completed', label: 'Completed', color: 'bg-blue-50 text-blue-700 border border-blue-100' },
    { key: 'cancelled', label: 'Cancelled', color: 'bg-rose-50 text-rose-700 border border-rose-100' },
    { key: 'refunded', label: 'Refunded', color: 'bg-purple-50 text-purple-700 border border-purple-100' },
    { key: 'failed', label: 'Failed', color: 'bg-gray-100 text-gray-700 border border-gray-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          {RANGE_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRangeDays(value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                rangeDays === value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Last {value}d
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base text-gray-600">{card.title}</p>
                  <p className="text-2xl font-semibold mt-2 text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <div className={`${card.accent} p-3 rounded-lg`}>
                  <Icon size={22} stroke={1.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-base text-gray-600">Revenue trend</p>
              <p className="text-2xl font-semibold text-gray-900">{summary ? formatCurrency(summary.revenue) : '—'}</p>
            </div>
            <div className="flex items-center gap-2 text-base text-gray-600">
              <IconChartAreaLine size={18} />
              <span>{trends.length ? `${trends.length} days` : 'No data'}</span>
            </div>
          </div>
          {loading ? (
            <div className="h-[140px] bg-gray-100 animate-pulse rounded" />
          ) : (
            <Sparkline points={revenueSeries} />
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-base text-gray-700">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Avg order value</p>
              <p className="font-semibold text-gray-900">{summary ? formatCurrency(summary.averageOrderValue) : '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Paid orders</p>
              <p className="font-semibold text-gray-900">{summary ? formatNumber(summary.paidCount) : '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="font-semibold text-gray-900">{summary ? formatNumber(summary.completedCount) : '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Pending value</p>
              <p className="font-semibold text-gray-900">{summary ? formatCurrency(summary.pendingValue) : '—'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base text-gray-600">Status mix</p>
            <IconCircleCheck size={18} className="text-emerald-600" />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusBadges.map((badge) => (
              <span
                key={badge.key}
                className={`px-3 py-2 rounded-full text-base font-medium ${badge.color}`}
              >
                {badge.label}
                <span className="ml-2 text-gray-700">{statusMap[badge.key] || 0}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-base text-gray-600">Top products</p>
          <span className="text-sm text-gray-500">Based on paid & completed orders</span>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 bg-gray-100 animate-pulse rounded" />
          </div>
        ) : topProducts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No products sold in this range.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {topProducts.map((product) => (
              <div key={product.productId} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden">
                    {product.coverImage ? (
                      <img src={product.coverImage} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gray-100" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.quantity} units • stock {product.stock}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-gray-500">{product.quantity} units</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-600">Latest messages</p>
            <p className="text-xs text-gray-500">
              {wsConnected ? 'Live updates enabled' : 'Live updates disconnected'}
            </p>
          </div>
          <span className="text-xs text-gray-500">Contact & custom quote</span>
        </div>

        {messagesError && (
          <div className="px-4 py-3 text-sm text-rose-700 bg-rose-50 border-b border-rose-100">
            {messagesError}
          </div>
        )}

        {messagesLoading ? (
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 bg-gray-100 animate-pulse rounded" />
          </div>
        ) : messages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No messages yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div key={msg.id} className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${msg.type === 'quote' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {msg.type === 'quote' ? 'Custom Quote' : 'Contact'}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{msg.name}</span>
                    <span className="text-xs text-gray-500">{msg.email}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {msg.subject || msg.teamName || 'Message'}
                  </p>
                  {msg.message && (
                    <p className="text-xs text-gray-500 mt-1">{msg.message}</p>
                  )}
                </div>
                <div className="text-xs text-gray-500 sm:text-right">
                  <div>{new Date(msg.createdAt).toLocaleString()}</div>
                  {msg.quantity ? <div>Qty: {msg.quantity}</div> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
