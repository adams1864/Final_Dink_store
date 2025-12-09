import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, Product as ApiProduct } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Filter } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const category = selectedCategory !== 'all' ? selectedCategory : undefined;
        const gender = selectedGender !== 'all' ? selectedGender : undefined;
        
        const data = await fetchProducts(category, gender);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory, selectedGender]);

  return (
    <div className="min-h-screen pt-20 bg-[#F4F4F4]">
      <div className="hero-bg py-12 mb-8 relative">
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="container mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#D92128] text-center uppercase relative z-10"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Catalog
          </h1>
          <p className="text-gray-700 text-center mt-4 relative z-10">
            Browse our collection of professional sportswear
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20">
        <div className="flex gap-8">
          <div className={`${showFilters ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-bold text-[#1A1A1A]"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Filters
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-[#1A1A1A] mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">All Products</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="match-kits"
                      checked={selectedCategory === 'match-kits'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">Match Kits</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="training"
                      checked={selectedCategory === 'training'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">Training</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="casual"
                      checked={selectedCategory === 'casual'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">Casual</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="accessories"
                      checked={selectedCategory === 'accessories'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">Accessories</span>
                  </label>
                </div>
              </div>

              <div className="mb-6 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-[#1A1A1A] mb-3">Gender</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="all"
                      checked={selectedGender === 'all'}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">All</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="men"
                      checked={selectedGender === 'men'}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">Men</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="women"
                      checked={selectedGender === 'women'}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">Women</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="kids"
                      checked={selectedGender === 'kids'}
                      onChange={(e) => setSelectedGender(e.target.value)}
                      className="mr-2 accent-[#D92128]"
                    />
                    <span className="text-gray-700">Kids</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedGender('all');
                }}
                className="w-full bg-[#D92128] text-white py-2 rounded-lg hover:bg-[#b91a20] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D92128]"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#D92128] text-white px-6 py-2 rounded-lg hover:bg-[#b91a20] transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedGender('all');
                  }}
                  className="mt-4 text-[#D92128] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
