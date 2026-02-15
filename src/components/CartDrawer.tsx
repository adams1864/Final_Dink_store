import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { formatPrice } from '../services/api';
import { MIN_ORDER_QTY, useCart } from '../contexts/CartContext';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, total, updateQuantity, removeItem, clear } = useCart();

  useEffect(() => {
    if (!open) return;
    // notify other UI (floating chat) that cart is open
    try {
      window.dispatchEvent(new CustomEvent('cart:open'));
    } catch {}

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      try {
        window.dispatchEvent(new CustomEvent('cart:close'));
      } catch {}
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fff1f1] flex items-center justify-center text-[#D92128]">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Cart</p>
              <p className="text-lg font-semibold text-[#1A1A1A]">{items.length} item{items.length === 1 ? '' : 's'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">Your cart is empty.</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="inline-flex items-center justify-center bg-[#D92128] text-white px-6 py-2 rounded-full hover:bg-[#b91a20]"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
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
                    <p className="text-xs text-gray-500 mt-1">Min per item: {MIN_ORDER_QTY}</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-semibold">{formatPrice(total)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clear}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-full font-medium hover:bg-gray-200"
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center bg-[#D92128] text-white py-2 rounded-full font-semibold hover:bg-[#b91a20]"
            >
              Checkout
            </Link>
          </div>
          <Link
            to="/cart"
            onClick={onClose}
            className="mt-3 inline-flex items-center justify-center w-full border border-gray-300 text-gray-700 py-2 rounded-full font-medium hover:bg-gray-100"
          >
            View Full Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
