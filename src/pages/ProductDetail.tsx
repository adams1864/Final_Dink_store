import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, createOrder, initChapaPayment, Product as ApiProduct } from '../services/api';
import { MIN_ORDER_QTY, useCart } from '../contexts/CartContext';
import { Phone, MessageCircle, Package, Droplet, Wind, Shield, Activity, X, ShoppingCart, Send } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [paymentRedirecting, setPaymentRedirecting] = useState(false);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const { addItem } = useCart();
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    quantity: MIN_ORDER_QTY,
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
    setPaymentRedirecting(false);
    
    try {
      const createdOrder = await createOrder({
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

      const paymentInit = await initChapaPayment(createdOrder.id);
      if (paymentInit.status === 'paid' && paymentInit.customerReceiptToken) {
        setOrderSuccess(true);
        return;
      }

      setPaymentRedirecting(true);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentInit.actionUrl;

      Object.entries(paymentInit.fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      form.remove();
    } catch (err: any) {
      setOrderError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  const resetOrderFlow = () => {
    setShowOrderModal(false);
    setOrderSuccess(false);
    setPaymentRedirecting(false);
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
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addItem(product, MIN_ORDER_QTY);
    setCartNotice('Added to cart.');
    window.setTimeout(() => setCartNotice(null), 2000);
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
                  onClick={resetOrderFlow}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Order Placed Successfully!</h3>
                  <p className="text-green-700">Payment confirmed. You can download your receipt on the return page.</p>
                </div>
              ) : paymentRedirecting ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-blue-600 text-4xl mb-4">...</div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Redirecting to payment</h3>
                  <p className="text-blue-700">Please wait while we open Chapa checkout.</p>
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
                        min={MIN_ORDER_QTY}
                        max={product.stock}
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum {MIN_ORDER_QTY} per item.</p>
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
                      {orderLoading ? 'Opening Chapa...' : 'Pay with Chapa'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    You will be redirected to Chapa to complete payment.
                  </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-lg shadow-lg p-6 lg:p-8 items-start">
          <div className="flex flex-col gap-4 lg:max-w-[520px]">
            <div className="mb-2 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/5] w-full">
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : product.coverImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {product.images.slice(1, 5).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-20 object-cover rounded-md border border-gray-100"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pt-1 space-y-6">
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

            <div className="relative overflow-hidden rounded-[26px] border border-[#f1e3e4] bg-[linear-gradient(135deg,#ffffff,#fff4f4)] p-6 shadow-[0_22px_50px_rgba(217,33,40,0.14)]">
              <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-[#D92128]/12 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#ffb347]/18 blur-2xl" />

              <div className="relative flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b55a5f]">
                    Action Arena
                  </p>
                  <p className="text-sm text-[#2b2b2b]">Choose your fastest route to order.</p>
                </div>
                <span className="text-xs font-semibold text-[#D92128] bg-white border border-[#f6c9cc] px-3 py-1 rounded-full shadow-sm">
                  Lightning checkout
                </span>
              </div>

              <div className="relative grid grid-cols-1 gap-3">
                <button
                  onClick={() => setShowOrderModal(true)}
                  disabled={isOutOfStock}
                  className={`w-full py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-3 shadow-xl ${
                    isOutOfStock
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[linear-gradient(120deg,#D92128,#f04a2e)] text-white hover:translate-y-[-1px] hover:shadow-2xl hover:shadow-red-200/80'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isOutOfStock ? 'Out of Stock' : 'Order Now'}
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-3 ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-white border border-[#f1c3c6] text-[#1A1A1A] hover:border-[#D92128] hover:text-[#D92128] hover:shadow-md'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart (min {MIN_ORDER_QTY})
                  </button>

                  <a
                    href="tel:+251900000000"
                    className="w-full bg-[#1a1a1a] text-white py-3 rounded-full font-semibold hover:bg-black transition-all flex items-center justify-center gap-3 shadow-md"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us
                  </a>
                </div>

                {cartNotice && (
                  <p className="text-sm text-green-600">{cartNotice}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`https://wa.me/251900000000?text=Hi, I'm interested in ${product.name}${product.sku ? ` (${product.sku})` : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0088cc] text-white px-4 py-3 rounded-full font-semibold hover:bg-[#007ab8] transition-all shadow-md"
                  >
                    <Send className="w-5 h-5" />
                    Telegram
                  </a>

                  <Link
                    to="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-gray-800 hover:bg-[#fff1f2] transition-all font-semibold border border-[#f1c3c6] shadow-sm"
                  >
                    Request Bulk Quote
                  </Link>
                </div>
              </div>
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
