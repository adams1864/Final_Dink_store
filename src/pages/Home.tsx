import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Swiper is used inside the HeroSection component; no direct imports needed here
import football3 from '../assets/football3.jpg';
import football2 from '../assets/football2.jpg';
import football from '../assets/football.jpg';
import football1 from '../assets/football1.jpg';
import kits from '../assets/kits.jpg';
import image4 from '../assets/image4.jpg';
import { Flag, Globe, Plane, Droplet, Wind, Shield, Star, BadgePercent, Trophy, Heart, ShoppingCart } from 'lucide-react';
import { fetchProductById, getSalesTopProducts, getTopRatedProducts, type TopRatedProduct } from '../services/api';
import { useCart } from '../contexts/CartContext';

import HeroSection from '../components/HeroSection';
import { FAQSection } from './FAQ';

// (Removed unused WingLineArt - not needed when HeroSection provides decorations)

const Home = () => {
  const heroImages: string[] = [football3, football2, football];
  const fallbackTopSellingProducts = [
    {
      id: 1,
      name: 'Velocity Pro Home Kit',
      category: 'Match Kits',
      image: football3,
      sold: '1,200+ sold',
    },
    {
      id: 2,
      name: 'Elite Training Jersey',
      category: 'Training',
      image: football2,
      sold: '980+ sold',
    },
    {
      id: 3,
      name: 'Performance Sports Socks',
      category: 'Accessories',
      image: image4,
      sold: '1,500+ sold',
    },
  ];

  const [topSellingProducts, setTopSellingProducts] = useState(fallbackTopSellingProducts);
  const [topRatedProducts, setTopRatedProducts] = useState<TopRatedProduct[]>([]);
  const [activeTopIndex, setActiveTopIndex] = useState(0);
  const [addingTopProductId, setAddingTopProductId] = useState<number | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;

    const loadTopSelling = async () => {
      try {
        const result = await getSalesTopProducts(30, 3);
        if (!mounted || !Array.isArray(result.products) || result.products.length === 0) {
          return;
        }

        const mapped = result.products.map((item) => ({
          id: item.productId,
          name: item.name,
          category: 'Top Seller',
          image: item.coverImage || image4,
          sold: `${item.quantity} sold`,
        }));

        setTopSellingProducts(mapped);
      } catch (error) {
        console.error('Failed to load top selling products:', error);
      }
    };

    loadTopSelling();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (topSellingProducts.length === 0) {
      setActiveTopIndex(0);
      return;
    }

    setActiveTopIndex((prev) => (prev >= topSellingProducts.length ? 0 : prev));
  }, [topSellingProducts]);

  useEffect(() => {
    if (topSellingProducts.length <= 1) return;

    const intervalId = setInterval(() => {
      setActiveTopIndex((prev) => (prev + 1) % topSellingProducts.length);
    }, 4500);

    return () => clearInterval(intervalId);
  }, [topSellingProducts]);

  const currentTopSeller = topSellingProducts[activeTopIndex] ?? topSellingProducts[0];
  const rotatedTopSellers = topSellingProducts.length
    ? Array.from({ length: topSellingProducts.length }, (_, offset) =>
        topSellingProducts[(activeTopIndex + offset) % topSellingProducts.length]
      )
    : [];
  const currentTopSellerRank = topSellingProducts.findIndex((item) => item.id === currentTopSeller?.id) + 1;
  const sideTopSellers = rotatedTopSellers.slice(1, 3);

  const handleQuickAddTopSeller = async (productId: number) => {
    if (!Number.isFinite(productId)) return;

    try {
      setAddingTopProductId(productId);
      const product = await fetchProductById(String(productId));
      if (!product) {
        return;
      }
      addItem(product, 1);
    } catch (error) {
      console.error('Failed to quick add top seller:', error);
    } finally {
      setAddingTopProductId(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadTopRated = async () => {
      try {
        // request a larger candidate set then filter client-side
        const data = await getTopRatedProducts(10);
        if (!mounted) return;
        // keep only products with averageRating > 4 and cap to 3 items
        const filtered = Array.isArray(data) ? data.filter((p) => (p?.averageRating ?? 0) > 4) : [];
        setTopRatedProducts(filtered.slice(0, 3));
      } catch (error) {
        console.error('Failed to load top-rated products:', error);
        if (mounted) {
          setTopRatedProducts([]);
        }
      }
    };

    loadTopRated();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection heroImages={heroImages} />

      <section className="py-12 bg-[#F4F4F4]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3
            className="text-center text-2xl font-bold text-[#1A1A1A] mb-8"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Born in Ethiopia, Worn Globally
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="text-center">
              <p className="text-sm text-gray-600">Official Partner</p>
              <p className="font-bold text-[#1A1A1A]">Ethiopian FC</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Trusted by</p>
              <p className="font-bold text-[#1A1A1A]">Local Clubs</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Supplied to</p>
              <p className="font-bold text-[#1A1A1A]">Regional Teams</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold text-center text-[#1A1A1A] mb-12"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/shop?category=match-kits"
              className="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
            >
              <img
                src={football1}
                alt="Football Kits"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Football Kits</h3>
                <p className="text-sm text-gray-200">Professional Match Wear</p>
              </div>
            </Link>

            <Link
              to="/shop?category=training"
              className="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
            >
              <img
                src={football2}
                alt="Training Wear"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Training Wear</h3>
                <p className="text-sm text-gray-200">High-Performance Gear</p>
              </div>
            </Link>

            <Link
              to="/shop?category=accessories"
              className="group relative overflow-hidden rounded-lg shadow-lg aspect-square"
            >
              <img
                src={kits}
                alt="Accessories"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Accessories</h3>
                <p className="text-sm text-gray-200">Complete Your Kit</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F4F4F4]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold text-center text-[#1A1A1A] mb-16"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Why Choose Dink?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-[#D92128] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Flag className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Ethiopian Craftsmanship
              </h3>
              <p className="text-gray-600">
                Handcrafted with pride in Addis Ababa, combining traditional quality with modern technology.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#D92128] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Global Standards
              </h3>
              <p className="text-gray-600">
                Meeting international quality standards with breathable, moisture-wicking fabrics.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#D92128] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Swift international shipping with trusted partners DHL, FedEx, and Ethiopian Airlines Cargo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl md:text-4xl font-bold text-center text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Customer Feedback
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm md:text-base">
            Real customer ratings, review counts, and likes by product.
          </p>

          {topRatedProducts.length === 0 ? (
            <div className="bg-[#F4F4F4] rounded-lg p-8 text-center text-gray-600">
              No real customer ratings yet.
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-3">
              {topRatedProducts.map((product, index) => (
                <Link
                  key={product.productId}
                  to={`/product/${product.productId}`}
                  className="group flex items-center gap-3 sm:gap-4 bg-white border border-[#EAEAEA] rounded-xl p-3 sm:p-4 hover:border-[#D9D9D9] hover:shadow-sm transition-all"
                >
                  <div className="relative shrink-0">
                    <img src={product.coverImage || image4} alt={product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" />
                    <span className="absolute -top-2 -right-2 bg-[#D92128] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A] truncate group-hover:text-[#D92128] transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${product.productId}-${index}`}
                          className={`w-3.5 h-3.5 ${index < Math.round(product.averageRating) ? 'text-[#D92128] fill-[#D92128]' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-1 text-xs sm:text-sm font-semibold text-[#1A1A1A]">{product.averageRating.toFixed(1)}/5</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-[#F8F8F8] text-gray-700 border border-gray-200 px-2 py-1 rounded-full">{product.ratingCount} reviews</span>
                      <span className="bg-[#F8F8F8] text-gray-700 border border-gray-200 px-2 py-1 rounded-full inline-flex items-center gap-1">
                        <Heart className="w-3 h-3 text-[#D92128]" /> {product.likeCount} likes
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white/5 border border-white/15 rounded-xl p-8 md:p-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BadgePercent className="w-6 h-6 text-[#D92128]" />
              <span className="text-sm uppercase tracking-wide text-gray-200">Customer Offer</span>
            </div>
            <h3
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Buy 5 Kits, Get 10% Off
            </h3>
            <p className="text-gray-300 mb-8">
              Perfect for teams and group orders. Buy 5 or more items and get an automatic 10% discount at checkout.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#D92128] text-white px-10 py-3 rounded-full font-medium hover:bg-[#b91a20] transition-colors"
            >
              Shop Team Deals
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F4F4F4]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#8C1B1B] mb-2">BEST SELLERS</p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Top Selling Products
              </h2>
              <p className="text-sm text-gray-600 mt-2">Most loved picks from recent customer orders.</p>
            </div>
            <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#D9252C] to-[#8E1015] border border-[#8E1015] text-white shadow-md">
              <Trophy className="w-4 h-4" />
            </div>
          </div>

          {topSellingProducts.length === 0 ? (
            <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 text-center text-gray-600">
              No top-selling products available right now.
            </div>
          ) : (
            <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-8">
                <div className="relative block rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[340px] bg-[#10151D] border border-[#2A303A] shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,0.08),transparent_45%)]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B1018] via-[#101821] to-[#101821]/70" />

                  <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#C61F27] to-[#891017] text-white px-3.5 py-1.5 text-sm font-semibold border border-[#E35A61] shadow-md">
                        <Trophy className="w-3.5 h-3.5" />
                        #{currentTopSellerRank > 0 ? currentTopSellerRank : 1} TOP SELLER
                      </div>
                    </div>

                    <div className="max-w-[60%] sm:max-w-[52%]">
                      <p className="mt-4 text-sm uppercase tracking-[0.18em] text-white/80">TOP SELLER</p>
                      <h3 className="text-4xl sm:text-6xl font-extrabold leading-[0.95] text-white drop-shadow-md mt-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {currentTopSeller?.name || 'Top Seller'}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/14 border border-white/25 text-white px-3 py-1.5 text-lg font-semibold">
                        <ShoppingCart className="w-4 h-4" />
                        {currentTopSeller?.sold || '—'}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (!currentTopSeller?.id) return;
                          void handleQuickAddTopSeller(currentTopSeller.id);
                        }}
                        disabled={!currentTopSeller?.id || addingTopProductId === currentTopSeller?.id}
                        className="mt-5 inline-flex items-center rounded-full bg-gradient-to-b from-[#C9343C] to-[#921118] border border-[#EA6A72] text-white px-6 py-2.5 text-2xl font-semibold shadow-[0_0_28px_rgba(217,33,40,0.55)] hover:from-[#d63f47] hover:to-[#9e171e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {addingTopProductId === currentTopSeller?.id ? 'Adding...' : 'Add to cart'}
                      </button>

                      <div>
                        <Link
                          to={currentTopSeller?.id ? `/product/${currentTopSeller.id}` : '/shop'}
                          className="mt-3 inline-flex items-center text-white/90 hover:text-white underline underline-offset-4 text-sm"
                        >
                          View product
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute right-0 bottom-0 w-[60%] sm:w-[52%] h-full flex items-end justify-end">
                    <img
                      src={currentTopSeller?.image || image4}
                      alt={currentTopSeller?.name || 'Top seller'}
                      className="max-h-[95%] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
                    />
                  </div>
                </div>

              </div>

              <div className="lg:col-span-4 space-y-4">
                {sideTopSellers.map((product) => {
                  const rank = topSellingProducts.findIndex((item) => item.id === product.id) + 1;
                  return (
                    <div
                      key={product.name + product.id}
                      className="w-full text-left bg-white border border-[#E5E5E5] rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#D6D6D6] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-cover border border-gray-100" />
                          <span className={`absolute -top-2 -left-2 h-8 w-8 rounded-full text-sm font-bold flex items-center justify-center shadow ${rank === 2 ? 'bg-gradient-to-b from-[#F0F0F0] to-[#BEBEBE] text-[#3E3E3E]' : 'bg-gradient-to-b from-[#F3D0A6] to-[#BF8452] text-[#5A351C]'}`}>
                            {rank > 0 ? rank : '-'}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-gray-700"><span className="font-semibold text-[#A11219]">#{rank > 0 ? rank : '-'}</span> <span className="uppercase tracking-wide">BEST SELLER</span></p>
                            <span className="shrink-0 rounded-full bg-[#F2F2F2] border border-[#E0E0E0] text-xs text-gray-700 px-2 py-1">
                              {product.sold}
                            </span>
                          </div>
                          <h4 className="text-[1.9rem]/[1.04] md:text-[2.05rem]/[1.02] font-extrabold text-[#1A1A1A] truncate mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {product.name}
                          </h4>
                          <div className="mt-1 text-sm text-gray-500">Top Seller</div>

                          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-[#454B53]" style={{ width: rank === 2 ? '62%' : '45%' }} />
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2 text-sm">
                            <button
                              type="button"
                              onClick={() => {
                                const nextIndex = topSellingProducts.findIndex((item) => item.id === product.id);
                                if (nextIndex >= 0) setActiveTopIndex(nextIndex);
                              }}
                              className="text-[#1A1A1A] font-medium hover:text-[#D92128] transition-colors"
                            >
                              view
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleQuickAddTopSeller(product.id)}
                              disabled={addingTopProductId === product.id}
                              className="inline-flex items-center gap-1 text-[#1A1A1A] font-medium hover:text-[#D92128] transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>{addingTopProductId === product.id ? 'Adding...' : 'Quick Add'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {topSellingProducts.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {topSellingProducts.map((product, index) => (
                  <button
                    key={product.name + product.id}
                    type="button"
                    onClick={() => setActiveTopIndex(index)}
                    className={`h-2 rounded-full transition-all ${index === activeTopIndex ? 'w-8 bg-[#D92128]' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to top seller ${index + 1}`}
                  />
                ))}
              </div>
            )}
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-4xl font-bold mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Performance Fabric Technology
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Our advanced fabric technology ensures you perform at your best, no matter the conditions.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Droplet className="w-6 h-6 text-[#D92128] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">Moisture Wicking</h4>
                    <p className="text-gray-400">Keeps you dry during intense activity</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Wind className="w-6 h-6 text-[#D92128] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">Breathable Mesh</h4>
                    <p className="text-gray-400">Superior ventilation for maximum comfort</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-[#D92128] mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-1">UV Protection</h4>
                    <p className="text-gray-400">Built-in sun protection for outdoor sports</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center">
              <img
                src={image4}
                alt="Performance Fabric"
                className="rounded-lg shadow-2xl w-[85%] sm:w-[75%] md:w-[65%] lg:w-[60%]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl font-bold text-[#1A1A1A] mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Ready to Elevate Your Team?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of teams who trust Dink Sports Wear for their professional kits.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[#D92128] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[#b91a20] transition-all duration-300 transform hover:scale-105"
          >
            Get Your Custom Quote
          </Link>
        </div>
      </section>

      {/* FAQ Section below main content */}
      <FAQSection />
    </div>
  );
};

export default Home;
