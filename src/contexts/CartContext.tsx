import { createContext, useContext, useMemo, useState } from 'react';
import type { Product } from '../services/api';

export const MIN_ORDER_QTY = 3;

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'dink.cart.v1';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.productId === 'number');
  } catch (_error) {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (_error) {
    // ignore storage errors
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  function setAndPersist(next: CartItem[]) {
    setItems(next);
    saveCart(next);
  }

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    function addItem(product: Product, quantity = 1) {
      if (quantity <= 0) return;
      const nextQty = Math.max(quantity, MIN_ORDER_QTY);
      const productImage = product.images?.[0] || product.coverImage || '';

      setAndPersist(
        items.some((item) => item.productId === product.id)
          ? items.map((item) => {
              if (item.productId !== product.id) return item;
              const mergedQty = item.quantity + nextQty;
              const clamped = Math.max(MIN_ORDER_QTY, Math.min(mergedQty, product.stock || item.stock));
              return { ...item, quantity: clamped };
            })
          : [
              ...items,
              {
                productId: product.id,
                name: product.name,
                price: product.price || 0,
                image: productImage,
                quantity: Math.max(MIN_ORDER_QTY, Math.min(nextQty, product.stock || nextQty)),
                stock: product.stock || 0,
              },
            ]
      );
    }

    function updateQuantity(productId: number, quantity: number) {
      if (quantity <= 0) {
        setAndPersist(items.filter((item) => item.productId !== productId));
        return;
      }
      const normalizedQty = Math.max(MIN_ORDER_QTY, quantity);
      setAndPersist(
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(normalizedQty, item.stock || normalizedQty) }
            : item
        )
      );
    }

    function removeItem(productId: number) {
      setAndPersist(items.filter((item) => item.productId !== productId));
    }

    function clear() {
      setAndPersist([]);
    }

    return { items, itemCount, total, addItem, updateQuantity, removeItem, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
