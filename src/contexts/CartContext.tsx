import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../services/api';

const STORAGE_KEY = 'dink_cart';

export const MIN_ORDER_QTY = 3;

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStoredItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) =>
      item &&
      typeof item.productId === 'number' &&
      typeof item.name === 'string' &&
      typeof item.price === 'number' &&
      typeof item.quantity === 'number'
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredItems());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const addItem = (product: Product, quantity = MIN_ORDER_QTY) => {
    const normalizedQty = Math.max(quantity, MIN_ORDER_QTY);
    const image = product.images?.[0] ?? product.coverImage ?? product.image1 ?? product.image2 ?? null;

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + normalizedQty }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: normalizedQty,
          image,
        },
      ];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const normalizedQty = Math.max(quantity, MIN_ORDER_QTY);
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: normalizedQty } : item
      )
    );
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, total, addItem, updateQuantity, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
