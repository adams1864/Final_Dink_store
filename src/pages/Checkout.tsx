import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { createOrder, initChapaPayment, formatPrice, validateDiscount } from '../services/api';
import { MIN_ORDER_QTY, useCart } from '../contexts/CartContext';

const Checkout = () => {
  const { items, total, clear, updateQuantity, removeItem } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ ok: boolean | null; message: string }>({ ok: null, message: '' });
  const [couponDiscountCents, setCouponDiscountCents] = useState(0);

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    deliveryPreferences: '',
    notes: '',
  });

  const totalQty = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotalCents = useMemo(() => Math.round(total * 100), [total]);
  const grandTotal = Math.max(0, total - couponDiscountCents / 100);

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    [items]
  );

  async function handleApplyCoupon() {
    if (!couponCode.trim()) {
      setCouponStatus({ ok: false, message: 'Enter a coupon code.' });
      setCouponDiscountCents(0);
      return;
    }

    try {
      setCouponStatus({ ok: null, message: 'Applying…' });
      const result = await validateDiscount(couponCode.trim(), subtotalCents, totalQty);
      setCouponDiscountCents(result.discountCents || 0);
      setCouponStatus({ ok: true, message: 'Coupon applied.' });
    } catch (err: any) {
      setCouponDiscountCents(0);
      setCouponStatus({ ok: false, message: err?.message || 'Invalid coupon.' });
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (orderItems.length === 0) return;
    const underMin = items.find((item) => item.quantity < MIN_ORDER_QTY);
    if (underMin) {
      setErrorMessage(`Minimum quantity is ${MIN_ORDER_QTY} per item.`);
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const createdOrder = await createOrder({
        items: orderItems,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        address: form.address,
        deliveryPreferences: form.deliveryPreferences || undefined,
        notes: form.notes || undefined,
        couponCode: couponCode.trim() || undefined,
      });

      const paymentInit = await initChapaPayment(createdOrder.id);
      if (paymentInit.status === 'paid' && paymentInit.customerReceiptToken) {
        clear();
        setSuccessMessage('Payment confirmed. Your order is complete.');
        return;
      }

      const formEl = document.createElement('form');
      formEl.method = 'POST';
      formEl.action = paymentInit.actionUrl;

      Object.entries(paymentInit.fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        formEl.appendChild(input);
      });

      document.body.appendChild(formEl);
      formEl.submit();
      formEl.remove();
    } catch (error: any) {
      setErrorMessage(error.message || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-[#F4F4F4]">
        <div className="container mx-auto px-6 py-16">
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add items to your cart before checking out.</p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-[#D92128] text-white px-6 py-2 rounded-lg hover:bg-[#b91a20]"
            >
              Go to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[#F4F4F4]">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Link to="/shop" className="text-[#D92128] hover:underline">
            ← Continue shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Your Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 border-b pb-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= MIN_ORDER_QTY}
                        className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 rounded border border-gray-200 hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="ml-2 inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum per item: {MIN_ORDER_QTY}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Discount</span>
                <span className={couponDiscountCents > 0 ? 'text-emerald-600 font-medium' : 'text-gray-400'}>
                  {couponDiscountCents > 0 ? `- ${formatPrice(couponDiscountCents / 100)}` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Checkout</h2>
            <p className="text-xs text-gray-500 mb-3">Minimum order quantity: {MIN_ORDER_QTY} per item.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon code</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Apply
                  </button>
                </div>
                {couponStatus.message && (
                  <p
                    className={`mt-2 text-xs ${
                      couponStatus.ok === false ? 'text-red-600' : couponStatus.ok === true ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {couponStatus.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.customerEmail}
                  onChange={(event) => setForm({ ...form, customerEmail: event.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.customerPhone}
                  onChange={(event) => setForm({ ...form, customerPhone: event.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Preferences</label>
                <textarea
                  value={form.deliveryPreferences}
                  onChange={(event) => setForm({ ...form, deliveryPreferences: event.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  rows={2}
                />
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#D92128] text-white py-3 rounded-lg font-semibold hover:bg-[#b91a20] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Opening Chapa...' : 'Pay with Chapa'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
