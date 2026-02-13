import { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MIN_ORDER_QTY, useCart } from '../contexts/CartContext';
import { formatPrice } from '../services/api';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, total, itemCount, updateQuantity, removeItem, clear } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('cart-open');
    return () => {
      document.body.classList.remove('cart-open');
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D92128]" />
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <span className="text-sm text-gray-500">({itemCount})</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-16">Your cart is empty.</div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 border-b pb-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 rounded border border-gray-200 hover:bg-gray-50"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= MIN_ORDER_QTY}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 rounded border border-gray-200 hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-5 py-4">
          <p className="text-xs text-gray-500 mb-2">Minimum order quantity: {MIN_ORDER_QTY} per item.</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-lg font-semibold">{formatPrice(total)}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={clear}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              disabled={items.length === 0}
            >
              Clear Cart
            </button>
            <button
              className="flex-1 bg-[#D92128] text-white py-2 rounded-lg hover:bg-[#b91a20]"
              disabled={items.length === 0}
              onClick={() => {
                if (items.length === 0) return;
                onClose();
                navigate('/checkout');
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
