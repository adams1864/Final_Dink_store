// API Service for backend communication

import { products as mockProducts, type Product as MockProduct } from '../data/products';

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  size: string;
  gender: string;
  price: number;
  stock: number;
  status: string;
  coverImage: string;
  image1: string | null;
  image2: string | null;
  images: string[];
  color: string;
  colorValues: string[];
  colors: { name: string; hex: string }[];
  sku: string;
  material: string;
  weight: string;
  fit: string;
  features: string[];
  isNew: boolean;
  isBestSeller: boolean;
  createdAt: string | null;
}

export interface ProductsResponse {
  data: Product[];
  meta: ProductListMeta;
}

export interface ProductListMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  sortBy?: 'createdAt' | 'price' | 'stock' | 'name' | 'status';
  sortOrder?: 'asc' | 'desc';
  status?: string;
  q?: string;
}

export interface ProductQuery {
  page?: number;
  perPage?: number;
  q?: string;
  status?: string;
  sortBy?: 'createdAt' | 'price' | 'stock' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  selectedSize?: string;
  selectedColor?: string;
  deliveryPreferences?: string;
  notes?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  selectedSize: string | null;
  selectedColor: string | null;
  deliveryPreferences: string | null;
  status: string;
  paymentStatus?: string | null;
  paymentProvider?: string | null;
  paymentTxRef?: string | null;
  paymentReference?: string | null;
  paymentVerifiedAt?: string | null;
  totalCents: number;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

function normalizeOrder(order: any): Order {
  const total = order.totalCents ? order.totalCents / 100 : 0;
  const status =
    order.paymentStatus === 'paid' && (order.status === 'pending' || order.status === 'failed')
      ? 'paid'
      : order.status;

  return {
    ...order,
    status,
    total,
  };
}

export interface CreateOrderResponse extends Order {
  customerReceiptToken?: string;
}

export const API_BASE_URL = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api').replace(/\/$/, '');
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

function mapMockProduct(mock: MockProduct, index: number): Product {
  const basePrice = 850 + index * 75;
  const stock = 12 - (index % 5) * 2;
  const imageList = mock.images ?? [];

  return {
    id: Number(mock.id),
    name: mock.name,
    description: mock.description,
    category: mock.category,
    size: 'S,M,L,XL',
    gender: mock.gender,
    price: basePrice,
    stock: Math.max(stock, 0),
    status: 'published',
    coverImage: imageList[0] ?? '',
    image1: imageList[1] ?? null,
    image2: imageList[2] ?? null,
    images: imageList,
    color: 'Red',
    colorValues: ['Red', 'Black', 'White'],
    colors: [
      { name: 'Red', hex: '#D92128' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    sku: mock.sku,
    material: mock.material,
    weight: mock.weight,
    fit: mock.fit,
    features: mock.features,
    isNew: Boolean(mock.isNew),
    isBestSeller: Boolean(mock.isBestSeller),
    createdAt: new Date().toISOString(),
  };
}

function getMockProducts(
  category?: string,
  gender?: string,
  query?: ProductQuery
): ProductsResponse {
  const normalizedCategory = category?.toLowerCase();
  const normalizedGender = gender?.toLowerCase();
  const search = query?.q?.toLowerCase().trim();

  let data = mockProducts.map((product, index) => mapMockProduct(product, index));

  if (normalizedCategory) {
    data = data.filter((product) => product.category.toLowerCase() === normalizedCategory);
  }

  if (normalizedGender) {
    data = data.filter((product) => product.gender.toLowerCase() === normalizedGender);
  }

  if (search) {
    data = data.filter((product) => {
      return (
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      );
    });
  }

  const meta = {
    page: 1,
    perPage: data.length,
    total: data.length,
    totalPages: 1,
  };

  return { data, meta };
}

/**
 * Fetch products with optional filters
 */
export async function fetchProducts(
  category?: string,
  gender?: string,
  query?: ProductQuery
): Promise<ProductsResponse> {
  if (USE_MOCK_DATA) {
    return getMockProducts(category, gender, query);
  }

  try {
    const params = new URLSearchParams();
    
    if (category && category !== 'all') {
      params.append('category', category);
    }
    
    if (gender && gender !== 'all') {
      params.append('gender', gender);
    }

    if (query?.q) params.append('q', query.q);
    if (query?.status) params.append('status', query.status);
    if (query?.page) params.append('page', String(query.page));
    if (query?.perPage) params.append('perPage', String(query.perPage));
    if (query?.sortBy) params.append('sortBy', query.sortBy);
    if (query?.sortOrder) params.append('sortOrder', query.sortOrder);
    
    const url = `${API_BASE_URL}/products?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data: ProductsResponse = await response.json();
    const meta = data.meta || {
      page: 1,
      perPage: data.data?.length || 0,
      total: data.data?.length || 0,
      totalPages: 1,
    };
    return { data: data.data || [], meta };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  if (USE_MOCK_DATA) {
    const match = mockProducts.find((product) => product.id === id);
    if (!match) {
      return null;
    }
    return mapMockProduct(match, Number(match.id));
  }

  try {
    const productId = Number(id);
    
    if (isNaN(productId)) {
      throw new Error('Invalid product ID');
    }
    
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    const data = await response.json();
    // Backend returns { product: {...} }, extract the nested object
    const product: Product = data.product || data;
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: OrderRequest): Promise<CreateOrderResponse> {
  if (USE_MOCK_DATA) {
    const now = new Date().toISOString();
    const totalCents = orderData.items.reduce((sum, item) => sum + item.quantity * 25000, 0);

    return {
      id: Date.now(),
      orderNumber: `MOCK-${Math.floor(Math.random() * 100000)}`,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      address: orderData.address,
      selectedSize: orderData.selectedSize ?? null,
      selectedColor: orderData.selectedColor ?? null,
      deliveryPreferences: orderData.deliveryPreferences ?? null,
      status: 'pending',
      totalCents,
      total: totalCents / 100,
      notes: orderData.notes ?? null,
      createdAt: now,
      updatedAt: now,
      customerReceiptToken: 'mock-receipt',
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create order: ${response.statusText}`);
    }
    
    const order: CreateOrderResponse = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export interface ChapaInitResponse {
  actionUrl: string;
  fields: Record<string, string>;
  txRef: string;
  orderId: number;
  status?: string;
  customerReceiptToken?: string;
}

export async function initChapaPayment(orderId: number): Promise<ChapaInitResponse> {
  if (USE_MOCK_DATA) {
    return {
      actionUrl: '#',
      fields: {},
      txRef: `MOCK-${Date.now()}`,
      orderId,
      status: 'paid',
      customerReceiptToken: 'mock-receipt',
    };
  }

  const response = await fetch(`${API_BASE_URL}/payments/chapa/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to initialize payment: ${response.statusText}`);
  }

  return response.json();
}

export interface ChapaVerifyResponse {
  status: 'success' | 'failed';
  orderId?: number;
  customerReceiptToken?: string;
}

export async function verifyChapaPayment(txRef: string): Promise<ChapaVerifyResponse> {
  if (USE_MOCK_DATA) {
    return { status: 'success', orderId: 0, customerReceiptToken: 'mock-receipt' };
  }

  const response = await fetch(`${API_BASE_URL}/payments/chapa/verify?tx_ref=${encodeURIComponent(txRef)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to verify payment: ${response.statusText}`);
  }

  return response.json();
}

export function getReceiptUrl(token: string, options: { download?: boolean } = {}): string {
  if (USE_MOCK_DATA) {
    return '/mock-receipt.txt';
  }

  const base = `${API_BASE_URL}/receipts/${token}`;
  if (options.download) {
    return `${base}?download=1`;
  }
  return base;
}

export interface OrderListMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  q?: string;
}

export interface OrderListResponse {
  data: Order[];
  meta: OrderListMeta;
}

export interface OrderQuery {
  page?: number;
  perPage?: number;
  q?: string;
  status?: string;
  sortBy?: 'createdAt' | 'status' | 'total';
  sortOrder?: 'asc' | 'desc';
}

export interface NewOrdersResponse {
  newCount: number;
  latestCreatedAt: string | null;
  latestOrders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    status: string;
    totalCents: number | null;
    createdAt: string;
  }>;
}

/**
 * Fetch orders with filters, pagination, sorting
 */
export async function getOrders(params: OrderQuery = {}): Promise<OrderListResponse> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.perPage) query.append('perPage', String(params.perPage));
    if (params.q) query.append('q', params.q);
    if (params.status) query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/orders${query.toString() ? `?${query.toString()}` : ''}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    const payload = await response.json();
    const dataArray = Array.isArray(payload) ? payload : payload.data;
    const meta: OrderListMeta = Array.isArray(payload)
      ? { page: 1, perPage: dataArray.length, total: dataArray.length, totalPages: 1 }
      : payload.meta;

    const data = dataArray.map((order: any) => normalizeOrder(order));

    return { data, meta };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getNewOrdersSince(since?: string | null): Promise<NewOrdersResponse> {
  const query = new URLSearchParams();
  if (since) query.append('since', since);

  const response = await fetch(`${API_BASE_URL}/orders/new${query.toString() ? `?${query.toString()}` : ''}`);
  if (!response.ok) {
    throw new Error(`Failed to check new orders: ${response.statusText}`);
  }

  return response.json();
}

export async function exportOrdersCsv(params: OrderQuery = {}): Promise<Blob> {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.status) query.append('status', params.status);
  const response = await fetch(`${API_BASE_URL}/orders/export${query.toString() ? `?${query.toString()}` : ''}`);
  if (!response.ok) {
    throw new Error(`Failed to export orders: ${response.statusText}`);
  }
  return response.blob();
}

/**
 * Get dashboard metadata/summary
 */
export interface MetaSummary {
  products: number;
  bundles: number;
  orders: number;
  leads: number;
  discounts: number;
  revenue: number;
}

export interface SalesSummary {
  rangeDays: number;
  from: string;
  to: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  pendingValue: number;
  pendingCount: number;
  paidCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesTrendsResponse {
  rangeDays: number;
  from: string;
  to: string;
  points: SalesTrendPoint[];
}

export interface SalesTopProduct {
  productId: number;
  name: string;
  coverImage: string | null;
  stock: number;
  quantity: number;
  revenue: number;
}

export interface SalesTopProductsResponse {
  rangeDays: number;
  from: string;
  to: string;
  products: SalesTopProduct[];
}

export interface SalesStatusCount {
  status: string;
  count: number;
}

export interface SalesStatusCountsResponse {
  rangeDays: number;
  from: string;
  to: string;
  statuses: SalesStatusCount[];
}

export async function getMeta(): Promise<MetaSummary> {
  try {
    const response = await fetch(`${API_BASE_URL}/meta`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    throw error;
  }
}

function buildRangeParams(rangeDays?: number) {
  const params = new URLSearchParams();
  if (rangeDays) {
    params.append('rangeDays', String(rangeDays));
  }
  return params;
}

export async function getSalesSummary(rangeDays?: number): Promise<SalesSummary> {
  const params = buildRangeParams(rangeDays);
  const response = await fetch(`${API_BASE_URL}/sales/summary${params.toString() ? `?${params.toString()}` : ''}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch sales summary: ${response.statusText}`);
  }

  return response.json();
}

export async function getSalesTrends(rangeDays?: number): Promise<SalesTrendsResponse> {
  const params = buildRangeParams(rangeDays);
  const response = await fetch(`${API_BASE_URL}/sales/trends${params.toString() ? `?${params.toString()}` : ''}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch sales trends: ${response.statusText}`);
  }

  return response.json();
}

export async function getSalesTopProducts(rangeDays?: number, limit?: number): Promise<SalesTopProductsResponse> {
  const params = buildRangeParams(rangeDays);
  if (limit) {
    params.append('limit', String(limit));
  }

  const response = await fetch(`${API_BASE_URL}/sales/top-products${params.toString() ? `?${params.toString()}` : ''}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch top products: ${response.statusText}`);
  }

  return response.json();
}

export async function getSalesStatusCounts(rangeDays?: number): Promise<SalesStatusCountsResponse> {
  const params = buildRangeParams(rangeDays);
  const response = await fetch(`${API_BASE_URL}/sales/status-counts${params.toString() ? `?${params.toString()}` : ''}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch status counts: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get single order by ID with items
 */
export async function getOrderById(id: number): Promise<Order & { items: any[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }
    
    const data = await response.json();
    return normalizeOrder(data) as Order & { items: any[] };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(id: number, status: string): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update order status: ${response.statusText}`);
    }
    
    const order: Order = await response.json();
    return normalizeOrder(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Delete product
 */
export async function deleteProduct(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Update product
 */
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update product: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.product || data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

/**
 * Format price in Ethiopian Birr
 */
export function formatPrice(price: number | undefined | null): string {
  const validPrice = price || 0;
  return `ETB ${validPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
