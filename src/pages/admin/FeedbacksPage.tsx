import { useEffect, useState } from 'react';
import { getAdminProductFeedback, type AdminProductFeedbackRow } from '../../services/api';

export default function FeedbacksPage() {
  const [rows, setRows] = useState<AdminProductFeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    void loadFeedback();
  }, [limit]);

  async function loadFeedback() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminProductFeedback(limit);
      setRows(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load feedback table');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Feedback</h2>
          <p className="text-sm text-gray-600">Customer ratings, likes and product feedback</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <button
            type="button"
            onClick={() => void loadFeedback()}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No feedback found</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.feedbackId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="font-medium text-gray-900">{row.productName}</div>
                      <div className="text-xs text-gray-500">ID: {row.productId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.rating}/5</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-lg">{row.comment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div>Avg: {row.averageRating.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">Ratings: {row.ratingCount}</div>
                      <div className="text-xs text-gray-500">Likes: {row.likeCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
