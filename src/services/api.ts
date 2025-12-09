// API Service for backend communication

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
  meta: {
    page: number;
    perPage: number;
    total: string;
    totalPages: number;
  };
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
  totalCents: number;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = '/api';

/**
 * Fetch products with optional filters
 */
export async function fetchProducts(
  category?: string,
  gender?: string
): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    
    if (category && category !== 'all') {
      params.append('category', category);
    }
    
    if (gender && gender !== 'all') {
      params.append('gender', gender);
    }

    // Fetch all products for now (comment out status filter to see all products)
    // params.append('status', 'published');
    
    const url = `${API_BASE_URL}/products?${params.toString()}`;
    console.log('Fetching products from:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data: ProductsResponse = await response.json();
    console.log('Products received:', data);
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id: string): Promise<Product | null> {
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
    
    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: OrderRequest): Promise<Order> {
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
    
    const order: Order = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Fetch all orders
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    
    const data = await response.json();
    // Backend returns array of orders with totalCents, convert to total
    return data.map((order: any) => ({
      ...order,
      total: order.totalCents ? order.totalCents / 100 : 0,
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
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

/**
 * Format price in Ethiopian Birr
 */
export function formatPrice(price: number | undefined | null): string {
  const validPrice = price || 0;
  return `ETB ${validPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
