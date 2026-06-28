import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../services/api';
import { useAuth } from './AuthContext';
import type { AuthUser } from '../services/auth';
import {
  cartStorageKey,
  readCartItems,
  writeCartItems,
  mergeCartItems,
  GUEST_CART_KEY,
  type CartItem,
} from '../utils/cartStorage';

export type { CartItem };

export const MIN_ORDER_QTY = 3;

interface CartContextValue {
  items: CartItem[];
  total: number;
  cartReady: boolean;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const PENDING_KEY = '__pending__';

function notifyCartChanged() {
  try {
    window.dispatchEvent(new CustomEvent('cart:changed'));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [storageKey, setStorageKey] = useState(PENDING_KEY);
  const [cartReady, setCartReady] = useState(false);

  const storageKeyRef = useRef(PENDING_KEY);
  const itemsRef = useRef<CartItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (authLoading) {
      setCartReady(false);
      return;
    }

    const nextKey = cartStorageKey(user);
    const prevKey = storageKeyRef.current;

    if (prevKey !== PENDING_KEY && prevKey !== nextKey) {
      writeCartItems(prevKey, itemsRef.current);
    }

    let loaded = readCartItems(nextKey);

    if (prevKey === GUEST_CART_KEY && nextKey !== GUEST_CART_KEY && itemsRef.current.length > 0) {
      loaded = mergeCartItems(loaded, itemsRef.current);
      writeCartItems(GUEST_CART_KEY, []);
    }

    storageKeyRef.current = nextKey;
    setStorageKey(nextKey);
    setItems(loaded);
    setCartReady(true);
    notifyCartChanged();
  }, [authLoading, user?.id, user?.email, user?.role]);

  useEffect(() => {
    if (!cartReady || storageKey === PENDING_KEY) return;
    writeCartItems(storageKey, items);
  }, [items, storageKey, cartReady]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const addItem = (product: Product, quantity = 1) => {
    const normalizedQty = Math.max(Number(quantity) || 1, 1);
    const image =
      product.images?.[0] ?? product.coverImage ?? product.image1 ?? product.image2 ?? null;
    const pid = Number(product.id);

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === pid);
      const next = existing
        ? prev.map((item) =>
            item.productId === pid
              ? { ...item, quantity: item.quantity + normalizedQty }
              : item,
          )
        : [
            ...prev,
            {
              productId: pid,
              name: product.name,
              price: Number(product.price) || 0,
              quantity: normalizedQty,
              image,
            },
          ];
      return next;
    });

    notifyCartChanged();
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const normalizedQty = Math.max(quantity, 1);
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: normalizedQty } : item,
      ),
    );
    notifyCartChanged();
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    notifyCartChanged();
  };

  const clear = () => {
    setItems([]);
    notifyCartChanged();
  };

  return (
    <CartContext.Provider
      value={{ items, total, cartReady, addItem, updateQuantity, removeItem, clear }}
    >
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
