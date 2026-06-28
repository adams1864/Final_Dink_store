import type { AuthUser } from '../services/auth';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

const LEGACY_KEY = 'dink_cart';
const GUEST_KEY = 'dink_cart:guest';

export function cartStorageKey(user: AuthUser | null): string {
  if (user?.role === 'customer') {
    if (user.id) return `dink_cart:user:${user.id}`;
    if (user.email) return `dink_cart:user:${user.email.toLowerCase()}`;
  }
  return GUEST_KEY;
}

function parseItems(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === 'number' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number',
    );
  } catch {
    return [];
  }
}

export function readCartItems(storageKey: string): CartItem[] {
  if (typeof window === 'undefined') return [];

  let items = parseItems(window.localStorage.getItem(storageKey));

  if (items.length === 0 && storageKey === GUEST_KEY) {
    items = parseItems(window.localStorage.getItem(LEGACY_KEY));
    if (items.length > 0) {
      window.localStorage.setItem(GUEST_KEY, JSON.stringify(items));
      window.localStorage.removeItem(LEGACY_KEY);
    }
  }

  return items;
}

export function writeCartItems(storageKey: string, items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(items));
}

export function mergeCartItems(base: CartItem[], incoming: CartItem[]): CartItem[] {
  const map = new Map<number, CartItem>();
  for (const item of base) {
    map.set(item.productId, { ...item });
  }
  for (const item of incoming) {
    const existing = map.get(item.productId);
    if (existing) {
      map.set(item.productId, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      map.set(item.productId, { ...item });
    }
  }
  return Array.from(map.values());
}

const GUEST_CART_KEY = GUEST_KEY;
export { GUEST_CART_KEY };
