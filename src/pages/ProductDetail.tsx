import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, createOrder, Product as ApiProduct } from '../services/api';
import { Phone, MessageCircle, Package, Droplet, Wind, Shield, Activity, X, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    quantity: 1,
    selectedSize: '',
    selectedColor: '',
    deliveryPreferences: '',
    notes: '',
  });

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(id);
        console.log('Product loaded:', data);
        console.log('Product price type:', typeof data?.price, 'value:', data?.price);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    setOrderLoading(true);
    setOrderError(null);
    
    try {
      await createOrder({
        items: [{
          productId: product.id,
          quantity: orderForm.quantity,
        }],
        customerName: orderForm.customerName,
        customerEmail: orderForm.customerEmail,
        customerPhone: orderForm.customerPhone,
        address: orderForm.address,
        selectedSize: orderForm.selectedSize || undefined,
        selectedColor: orderForm.selectedColor || undefined,
        deliveryPreferences: orderForm.deliveryPreferences || undefined,
        notes: orderForm.notes || undefined,
      });
      
      setOrderSuccess(true);
      setTimeout(() => {
        setShowOrderModal(false);
        setOrderSuccess(false);
        setOrderForm({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          address: '',
          quantity: 1,
          selectedSize: '',
          selectedColor: '',
          deliveryPreferences: '',
          notes: '',
        });
      }, 2000);
    } catch (err: any) {
      setOrderError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D92128]"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-[#D92128] hover:underline">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const featureIcons: Record<string, JSX.Element> = {
    'Moisture Wicking': <Droplet className="w-5 h-5" />,
    '4-Way Stretch': <Activity className="w-5 h-5" />,
    'UV Protection': <Shield className="w-5 h-5" />,
    'Breathable Mesh': <Wind className="w-5 h-5" />,
    'Quick Dry': <Droplet className="w-5 h-5" />,
    'Anti-Bacterial': <Shield className="w-5 h-5" />,
  };

  const isOutOfStock = product.stock === 0;
  const availableSizes = product.size ? product.size.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen pt-20 bg-[#F4F4F4]">
      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Order {product.name}
                </h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Order Placed Successfully!</h3>
                  <p className="text-green-700">Our team will contact you shortly to confirm your order.</p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={orderForm.customerName}
                        onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
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
                        value={orderForm.customerEmail}
                        onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderForm.customerPhone}
                      onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                      placeholder="+251..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max={product.stock}
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                      />
                    </div>

                    {availableSizes.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size (Optional)
                        </label>
                        <select
                          value={orderForm.selectedSize}
                          onChange={(e) => setOrderForm({ ...orderForm, selectedSize: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                        >
                          <option value="">Select size</option>
                          {availableSizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {product.colorValues.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color (Optional)
                        </label>
                        <select
                          value={orderForm.selectedColor}
                          onChange={(e) => setOrderForm({ ...orderForm, selectedColor: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                        >
                          <option value="">Select color</option>
                          {product.colorValues.map(color => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Preferences (Optional)
                    </label>
                    <textarea
                      value={orderForm.deliveryPreferences}
                      onChange={(e) => setOrderForm({ ...orderForm, deliveryPreferences: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                      rows={2}
                      placeholder="Any special delivery instructions..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                      rows={2}
                    />
                  </div>

                  {orderError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                      {orderError}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowOrderModal(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={orderLoading}
                      className="flex-1 bg-[#D92128] text-white py-3 rounded-lg font-medium hover:bg-[#b91a20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {orderLoading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Link to="/shop" className="text-[#D92128] hover:underline">
            ← Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-lg shadow-lg p-8">
          <div>
            <div className="mb-4">
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : product.coverImage}
                alt={product.name}
                className="w-full rounded-lg shadow-md"
              />
            </div>
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              {product.isNew && (
                <span className="bg-[#D92128] text-white text-xs font-bold px-3 py-1 rounded-full">
                  NEW
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1 rounded-full">
                  BEST SELLER
                </span>
              )}
              {isOutOfStock && (
                <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  OUT OF STOCK
                </span>
              )}
            </div>

            <h1
              className="text-4xl font-bold text-[#1A1A1A] mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {product.name}
            </h1>

            {product.sku && <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>}

            <div className="mb-6">
              <p className="text-4xl font-bold text-[#D92128]">
                ETB {(product.price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className={`text-sm mt-2 ${isOutOfStock ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock || 0} units in stock`}
              </p>
            </div>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {(product.material || product.weight || product.fit) && (
              <div className="bg-[#F4F4F4] rounded-lg p-6 mb-8">
                <h3
                  className="text-xl font-bold text-[#1A1A1A] mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Technical Specifications
                </h3>
                <div className="space-y-3">
                  {product.material && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-[#D92128]" />
                      <div>
                        <span className="font-medium text-gray-900">Material:</span>
                        <span className="text-gray-700 ml-2">{product.material}</span>
                      </div>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-[#D92128]" />
                      <div>
                        <span className="font-medium text-gray-900">Weight:</span>
                        <span className="text-gray-700 ml-2">{product.weight}</span>
                      </div>
                    </div>
                  )}
                  {product.fit && (
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-[#D92128]" />
                      <div>
                        <span className="font-medium text-gray-900">Fit:</span>
                        <span className="text-gray-700 ml-2">{product.fit}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h3
                  className="text-xl font-bold text-[#1A1A1A] mb-4"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="text-[#D92128]">
                        {featureIcons[feature] || <Package className="w-5 h-5" />}
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => setShowOrderModal(true)}
                disabled={isOutOfStock}
                className={`w-full py-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 ${
                  isOutOfStock
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#D92128] text-white hover:bg-[#b91a20]'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? 'Out of Stock' : 'Order Now'}
              </button>
              <a
                href="tel:+251900000000"
                className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
              >
                <Phone className="w-5 h-5" />
                Call Us
              </a>
              <a
                href={`https://wa.me/251900000000?text=Hi, I'm interested in ${product.name}${product.sku ? ` (${product.sku})` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-4 rounded-lg font-medium hover:bg-[#1fb855] transition-colors flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Inquiry
              </a>
              <Link
                to="/contact"
                className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                Request Bulk Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2
            className="text-3xl font-bold text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Need Custom Team Kits?
          </h2>
          <p className="text-gray-700 mb-6">
            We specialize in creating custom team kits with your logo, colors, and design. Minimum order quantity applies.
          </p>
          <Link
            to="/custom-kits"
            className="inline-block bg-[#D92128] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#b91a20] transition-colors"
          >
            Learn More About Custom Kits
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
