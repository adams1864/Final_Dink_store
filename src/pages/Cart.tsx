import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../services/api';
import { MIN_ORDER_QTY, useCart } from '../contexts/CartContext';

const Cart = () => {
  const { items, total, updateQuantity, removeItem, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 bg-[#F4F4F4]">
        <div className="container mx-auto px-6 py-16">
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
              <ShoppingCart className="w-6 h-6 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add items to your cart to continue.</p>
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

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pt-24 bg-[#F4F4F4]">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/shop" className="text-[#D92128] hover:underline">
             Continue shopping
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Your Cart</h2>
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
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Items</span>
                <span className="text-gray-900 font-medium">{totalQty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/checkout"
                className="inline-flex items-center justify-center bg-[#D92128] text-white px-6 py-2 rounded-lg hover:bg-[#b91a20] transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
