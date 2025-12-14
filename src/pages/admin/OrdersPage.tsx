import { useEffect, useRef, useState } from 'react';
import { getOrders, updateOrderStatus, getOrderById, exportOrdersCsv, getNewOrdersSince, type Order, type OrderListMeta } from '../../services/api';
import {
  STATUS_COLORS,
  STATUS_LABELS,
  getAllowedStatuses,
  validateStatusTransition,
  isTerminalStatus,
  type OrderStatus,
} from '../../utils/orderStatusRules';
import { X } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<OrderListMeta | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<(Order & { items?: any[] }) | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'status' | 'total'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [latestSeenCreatedAt, setLatestSeenCreatedAt] = useState<string | null>(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newOrdersLatestAt, setNewOrdersLatestAt] = useState<string | null>(null);
  const [newOrdersPreview, setNewOrdersPreview] = useState<
    { id: number; orderNumber: string; customerName: string; status: string; totalCents: number | null; createdAt: string }[]
  >([]);
  const latestSeenRef = useRef<string | null>(null);
  const pollingRef = useRef(false);

  const [liveStatus, setLiveStatus] = useState<'running' | 'paused'>('running');
  const [pollError, setPollError] = useState<string | null>(null);

  const BASELINE_KEY = 'orders.latestSeenCreatedAt';

  function setBaseline(nextIso: string | null, { force }: { force?: boolean } = {}) {
    if (!nextIso) return;
    const nextTs = Date.parse(nextIso);
    if (!Number.isFinite(nextTs)) return;
    const currentTs = latestSeenRef.current ? Date.parse(latestSeenRef.current) : 0;
    if (!force && currentTs && nextTs <= currentTs) return;

    const normalized = new Date(nextTs).toISOString();
    latestSeenRef.current = normalized;
    setLatestSeenCreatedAt(normalized);
    try {
      localStorage.setItem(BASELINE_KEY, normalized);
    } catch (_) {
      // ignore storage errors
    }
  }

  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem(BASELINE_KEY);
      } catch (_) {
        return null;
      }
    })();

    if (stored) {
      const ts = Date.parse(stored);
      if (Number.isFinite(ts)) {
        latestSeenRef.current = new Date(ts).toISOString();
        setLatestSeenCreatedAt(latestSeenRef.current);
      }
    }

    loadOrders();
  }, [page, perPage, sortBy, sortOrder, statusFilter, searchTerm]);

  useEffect(() => {
    if (!latestSeenCreatedAt) return;

    void checkForNewOrders(true);
    const interval = setInterval(() => {
      void checkForNewOrders();
    }, 20000);

    return () => clearInterval(interval);
  }, [latestSeenCreatedAt]);

  useEffect(() => {
    function handleVisibility() {
      if (!document.hidden && latestSeenCreatedAt) {
        void checkForNewOrders(true);
      }
    }

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [latestSeenCreatedAt]);

  async function loadOrders() {
    try {
      setLoading(true);
      const result = await getOrders({
        page,
        perPage,
        q: searchTerm,
        status: statusFilter || undefined,
        sortBy,
        sortOrder,
      });
      setOrders(result.data);
      setMeta(result.meta);

      const latestTimestamp = result.data.reduce((acc, order) => {
        const ts = order.createdAt ? Date.parse(order.createdAt) : 0;
        return Number.isFinite(ts) && ts > acc ? ts : acc;
      }, 0);

      // Initialize baseline only on first load
      if (!latestSeenRef.current) {
        if (latestTimestamp > 0) {
          setBaseline(new Date(latestTimestamp).toISOString(), { force: true });
        } else {
          setBaseline(new Date().toISOString(), { force: true });
        }
      }

      // Fallback: if new orders exist beyond baseline (missed notification), raise banner
      const baselineTs = latestSeenRef.current ? Date.parse(latestSeenRef.current) : 0;
      if (baselineTs && latestTimestamp > baselineTs) {
        const fresh = result.data
          .filter((o) => {
            const ts = o.createdAt ? Date.parse(o.createdAt) : 0;
            return Number.isFinite(ts) && ts > baselineTs;
          })
          .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
          .slice(0, 3)
          .map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customerName,
            status: o.status,
            totalCents: o.totalCents,
            createdAt: o.createdAt,
          }));

        setNewOrdersCount(fresh.length > 0 ? fresh.length : result.data.length);
        setNewOrdersLatestAt(result.data[0]?.createdAt ?? null);
        setNewOrdersPreview(fresh);
      } else {
        setNewOrdersCount(0);
        setNewOrdersLatestAt(null);
        setNewOrdersPreview([]);
      }
    } catch (error) {
      console.error('Failed to load orders', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function checkForNewOrders(force = false) {
    if (!latestSeenCreatedAt) return;
    if (pollingRef.current && !force) return;
    if (document.hidden && !force) return;

    pollingRef.current = true;

    try {
      const result = await getNewOrdersSince(latestSeenCreatedAt);
      setPollError(null);
      setLiveStatus('running');
      const baselineTs = latestSeenRef.current ? Date.parse(latestSeenRef.current) : 0;
      const latestTs = result.latestCreatedAt ? Date.parse(result.latestCreatedAt as string) : 0;

      // Ignore if API latest is not newer than baseline
      if (latestTs && baselineTs && latestTs <= baselineTs) {
        setNewOrdersCount(0);
        setNewOrdersLatestAt(null);
        setNewOrdersPreview([]);
        return;
      }

      setNewOrdersCount(result.newCount || 0);
      setNewOrdersLatestAt(result.latestCreatedAt || null);
      setNewOrdersPreview(result.latestOrders || []);
      if ((result.newCount || 0) === 0 && result.latestCreatedAt) {
        // advance baseline silently when backend reports no new but returns a newer timestamp
        setBaseline(result.latestCreatedAt);
      }
    } catch (error) {
      console.error('Failed to check new orders', error);
      setPollError('Live updates paused. Click to resume or refresh.');
      setLiveStatus('paused');
    } finally {
      pollingRef.current = false;
    }
  }

  function acknowledgeNewOrders() {
    const nowIso = new Date().toISOString();
    const latestTs = newOrdersLatestAt ? Date.parse(newOrdersLatestAt) : 0;
    const bestIso = Number.isFinite(latestTs) && latestTs > 0
      ? new Date(Math.max(latestTs, Date.parse(nowIso))).toISOString()
      : nowIso;
    setBaseline(bestIso, { force: true });

    setNewOrdersCount(0);
    setNewOrdersLatestAt(null);
    setNewOrdersPreview([]);
    setPollError(null);
    setLiveStatus('running');
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  async function handleExport() {
    try {
      const blob = await exportOrdersCsv({ q: searchTerm, status: statusFilter || undefined });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export orders');
    }
  }

  async function handleViewDetails(orderId: number) {
    try {
      const orderDetails = await getOrderById(orderId);
      setSelectedOrder(orderDetails);
      setShowDetailModal(true);
    } catch (error) {
      alert('Failed to load order details');
    }
  }

  async function handleStatusChange(orderId: number, currentStatus: OrderStatus, newStatus: OrderStatus) {
    const validation = validateStatusTransition(currentStatus, newStatus);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    if (!confirm(`Are you sure you want to change status from "${STATUS_LABELS[currentStatus]}" to "${STATUS_LABELS[newStatus]}"?`)) {
      return;
    }

    try {
      setUpdatingStatus(true);
      await updateOrderStatus(orderId, newStatus);
      await loadOrders(); // Refresh orders list
      alert('Order status updated successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orders Management</h2>
          <p className="text-gray-600 text-sm">Track and manage all customer orders</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Download CSV
          </button>
        </div>
      </div>

      {pollError && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg text-sm">
          <span>{pollError}</span>
          <button
            onClick={() => {
              setPollError(null);
              setLiveStatus('running');
              void checkForNewOrders(true);
            }}
            className="px-3 py-1 bg-amber-600 text-white rounded-md text-xs font-semibold hover:bg-amber-700"
          >
            Resume
          </button>
        </div>
      )}

      {newOrdersCount > 0 && (
        <div className="flex flex-col gap-3 bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-lg">
          <div className="font-medium">
            {newOrdersCount} new {newOrdersCount === 1 ? 'order' : 'orders'} since your last refresh.
          </div>

          {newOrdersPreview.length > 0 && (
            <div className="space-y-2 text-sm">
              {newOrdersPreview.map((o) => (
                <div key={o.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white/70 border border-blue-100 rounded px-3 py-2">
                  <div>
                    <div className="font-semibold">{o.orderNumber}</div>
                    <div className="text-blue-800">{o.customerName}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-semibold">ETB {(o.totalCents ? o.totalCents / 100 : 0).toLocaleString()}</div>
                    <div className="text-blue-700">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                setPage(1);
                acknowledgeNewOrders();
                void loadOrders();
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh now
            </button>
            <button
              onClick={acknowledgeNewOrders}
              className="px-3 py-2 border border-blue-200 rounded-lg hover:bg-white/60"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 w-full md:max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, customer, email"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="status">Sort by Status</option>
            <option value="total">Sort by Total</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

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
                  Phone
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const orderStatus = order.status as OrderStatus;
                  const allowedStatuses = getAllowedStatuses(orderStatus);
                  const terminal = isTerminalStatus(orderStatus);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {(order as any).customerPhone || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {terminal ? (
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              STATUS_COLORS[orderStatus] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {STATUS_LABELS[orderStatus]}
                          </span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, orderStatus, e.target.value as OrderStatus)
                            }
                            disabled={updatingStatus}
                            className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
                              STATUS_COLORS[orderStatus] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <option value={order.status}>{STATUS_LABELS[orderStatus]}</option>
                            {allowedStatuses.map((status) => (
                              <option key={status} value={status}>
                                → {STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ETB {order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          {meta ? (
            <>Page {meta.page} of {meta.totalPages} · Total {meta.total} orders</>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={meta ? meta.page <= 1 : true}
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => (meta ? Math.min(meta.totalPages, p + 1) : p + 1))}
            disabled={meta ? meta.page >= meta.totalPages : true}
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Order Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        STATUS_COLORS[selectedOrder.status as OrderStatus] ||
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {STATUS_LABELS[selectedOrder.status as OrderStatus]}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p className="text-sm">{selectedOrder.customerEmail}</p>
                  <p className="text-sm">{(selectedOrder as any).customerPhone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p>{selectedOrder.address}</p>
                </div>

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Order Items</p>
                    <div className="border rounded-lg">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedOrder.items.map((item: any, idx: number) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 text-sm">{item.productName}</td>
                              <td className="px-4 py-2 text-sm">{item.quantity}</td>
                              <td className="px-4 py-2 text-sm">ETB {item.price.toLocaleString()}</td>
                              <td className="px-4 py-2 text-sm">ETB {(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>ETB {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
