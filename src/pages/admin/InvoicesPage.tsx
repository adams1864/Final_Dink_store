import { useEffect, useMemo, useState } from 'react';
import { getInvoiceByOrderId, getInvoiceUrl, getOrders, type InvoiceSummary, type Order, type OrderListMeta } from '../../services/api';

function formatCurrencyCents(cents?: number | null) {
  const value = Number.isFinite(cents) ? (cents as number) / 100 : 0;
  return `ETB ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export default function InvoicesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<OrderListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('paid');
  const [sortBy, setSortBy] = useState<'createdAt' | 'status' | 'total'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [invoiceMap, setInvoiceMap] = useState<Record<number, InvoiceSummary>>({});
  const [invoiceLoading, setInvoiceLoading] = useState<Record<number, boolean>>({});
  const [invoiceErrors, setInvoiceErrors] = useState<Record<number, string | null>>({});

  useEffect(() => {
    void loadOrders();
  }, [page, perPage, sortBy, sortOrder, statusFilter]);

  async function loadOrders() {
    try {
      setLoading(true);
      setError(null);
      const result = await getOrders({
        page,
        perPage,
        q: searchTerm || undefined,
        status: statusFilter || undefined,
        sortBy,
        sortOrder,
      });
      setOrders(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err?.message || 'Failed to load invoices');
      setOrders([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    await loadOrders();
  }

  async function fetchInvoice(orderId: number) {
    setInvoiceLoading((prev) => ({ ...prev, [orderId]: true }));
    setInvoiceErrors((prev) => ({ ...prev, [orderId]: null }));

    try {
      const invoice = await getInvoiceByOrderId(orderId);
      setInvoiceMap((prev) => ({ ...prev, [orderId]: invoice }));
    } catch (err: any) {
      setInvoiceErrors((prev) => ({ ...prev, [orderId]: err?.message || 'Unable to load invoice' }));
    } finally {
      setInvoiceLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  }

  const invoiceEligibleMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    orders.forEach((order) => {
      const status = order.status?.toLowerCase();
      const paymentStatus = order.paymentStatus?.toLowerCase();
      map[order.id] = status === 'paid' || status === 'completed' || paymentStatus === 'paid';
    });
    return map;
  }, [orders]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Management</h2>
          <p className="text-sm text-gray-600">Review paid orders and download invoices</p>
        </div>
        <div className="text-xs text-gray-500">
          {meta ? `Total ${meta.total} orders` : ''}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 w-full md:max-w-xl">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order # or customer"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
            <option value="paid">Paid</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
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
                  Order Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issued
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const invoice = invoiceMap[order.id];
                  const eligible = invoiceEligibleMap[order.id];
                  const isLoading = invoiceLoading[order.id];
                  const loadError = invoiceErrors[order.id];

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                        {order.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {invoice ? invoice.invoiceNumber : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatCurrencyCents(order.totalCents)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice?.issuedAt ? new Date(invoice.issuedAt).toLocaleString() : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col gap-2">
                          {invoice ? (
                            <div className="flex items-center gap-2">
                              <a
                                href={getInvoiceUrl(invoice.token, { download: true })}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Download
                              </a>
                              <a
                                href={getInvoiceUrl(invoice.token)}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-600 hover:text-gray-800"
                              >
                                Preview
                              </a>
                            </div>
                          ) : eligible ? (
                            <button
                              type="button"
                              onClick={() => fetchInvoice(order.id)}
                              disabled={isLoading}
                              className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              {isLoading ? 'Loading...' : 'Generate invoice'}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">Unavailable</span>
                          )}
                          {loadError && <span className="text-xs text-rose-600">{loadError}</span>}
                        </div>
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
    </div>
  );
}
