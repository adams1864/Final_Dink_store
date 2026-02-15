import { useEffect, useState } from 'react';
import { createDiscount, deleteDiscount, getDiscounts, updateDiscount, type DiscountRecord } from '../../services/api';

function formatCurrencyCents(cents?: number | null) {
  const value = Number.isFinite(cents) ? (cents as number) / 100 : 0;
  return `ETB ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: '',
    type: 'percent' as 'percent' | 'fixed',
    value: '',
    minQty: '',
    minSubtotal: '',
    maxUses: '',
    startsAt: '',
    endsAt: '',
  });

  useEffect(() => {
    void loadDiscounts();
  }, []);

  async function loadDiscounts() {
    try {
      setLoading(true);
      setError(null);
      const data = await getDiscounts();
      setDiscounts(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load discounts');
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    if (!form.code.trim() || !form.value) return;

    try {
      setSubmitting(true);
      await createDiscount({
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minQty: form.minQty ? Number(form.minQty) : undefined,
        minSubtotalCents: form.minSubtotal ? Math.round(Number(form.minSubtotal) * 100) : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
      });
      setForm({
        code: '',
        type: 'percent',
        value: '',
        minQty: '',
        minSubtotal: '',
        maxUses: '',
        startsAt: '',
        endsAt: '',
      });
      await loadDiscounts();
    } catch (err: any) {
      setError(err?.message || 'Failed to create discount');
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(discount: DiscountRecord) {
    try {
      await updateDiscount(discount.id, { active: !discount.active });
      await loadDiscounts();
    } catch (err: any) {
      setError(err?.message || 'Failed to update discount');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this discount?')) return;
    try {
      await deleteDiscount(id);
      await loadDiscounts();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete discount');
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discounts</h2>
          <p className="text-sm text-gray-600">Manage coupon codes and rules</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Code</label>
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="percent">Percent</option>
            <option value="fixed">Fixed amount</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
          <input
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            min="1"
            step="1"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Min qty</label>
          <input
            type="number"
            value={form.minQty}
            onChange={(e) => setForm({ ...form, minQty: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            min="0"
            step="1"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Min subtotal (ETB)</label>
          <input
            type="number"
            value={form.minSubtotal}
            onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Max uses</label>
          <input
            type="number"
            value={form.maxUses}
            onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            min="0"
            step="1"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Starts at</label>
          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Ends at</label>
          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="md:col-span-2 xl:col-span-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Create discount'}
          </button>
        </div>
      </form>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rules</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No discounts found</td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{discount.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{discount.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {discount.type === 'percent' ? `${discount.value}%` : formatCurrencyCents(discount.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      <div>Min qty: {discount.minQty ?? '—'}</div>
                      <div>Min subtotal: {discount.minSubtotalCents ? formatCurrencyCents(discount.minSubtotalCents) : '—'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {discount.uses} / {discount.maxUses ?? '∞'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${discount.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                        {discount.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(discount)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {discount.active ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(discount.id)}
                          className="text-rose-600 hover:text-rose-800"
                        >
                          Delete
                        </button>
                      </div>
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
