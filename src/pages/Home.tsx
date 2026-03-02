import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Swiper is used inside the HeroSection component; no direct imports needed here
import football3 from '../assets/football3.jpg';
import football2 from '../assets/football2.jpg';
import football from '../assets/football.jpg';
import football1 from '../assets/football1.jpg';
import kits from '../assets/kits.jpg';
import image4 from '../assets/image4.jpg';
import { Flag, Globe, Plane, Droplet, Wind, Shield, Star, BadgePercent, Trophy, Heart } from 'lucide-react';
import { getSalesTopProducts, getTopRatedProducts, type TopRatedProduct } from '../services/api';

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
    let mounted = true;

    const loadTopRated = async () => {
      try {
        const data = await getTopRatedProducts(3);
        if (!mounted) return;
        setTopRatedProducts(data);
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

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-bold text-center text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Customer Product Ratings
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Real customer ratings, review counts, and likes by product.
          </p>

          {topRatedProducts.length === 0 ? (
            <div className="bg-[#F4F4F4] rounded-lg p-8 text-center text-gray-600">
              No real customer ratings yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topRatedProducts.map((product) => (
                <Link key={product.productId} to={`/product/${product.productId}`} className="bg-[#F4F4F4] rounded-lg overflow-hidden">
                  <img src={product.coverImage || image4} alt={product.name} className="w-full h-44 object-cover" />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-3">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${product.productId}-${index}`}
                          className={`w-5 h-5 ${index < Math.round(product.averageRating) ? 'text-[#D92128] fill-[#D92128]' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-700">
                      <span className="font-semibold text-[#1A1A1A]">{product.averageRating.toFixed(1)}/5</span>
                      <span>{product.ratingCount} customer reviews</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                      <Heart className="w-4 h-4 text-[#D92128]" />
                      <span>{product.likeCount} customers like this product</span>
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
          <div className="flex items-center justify-between mb-10">
            <h2
              className="text-4xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Top Sellings
            </h2>
            <Trophy className="w-8 h-8 text-[#D92128]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topSellingProducts.map((product) => (
              <Link
                key={product.name + product.id}
                to={product.id ? `/product/${product.id}` : '/shop'}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                <div className="p-5">
                  <p className="text-sm text-[#D92128] font-semibold mb-1">{product.category}</p>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Top seller</span>
                    <span className="text-gray-600">{product.sold}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
