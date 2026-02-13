import { useState, useEffect } from 'react';
import logo from '../assets/logo1.png';
import { Link, useLocation } from 'react-router-dom';
import { Send, Menu, X, ShoppingCart } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Dink Sports Wear"
              className="h-12 w-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                dink
              </span>
              <span className="text-xs text-[#1A1A1A] -mt-1">SPORTS WEAR</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isActive('/')
                  ? 'text-[#D92128] border-b-2 border-[#D92128]'
                  : isScrolled
                  ? 'text-[#1A1A1A] hover:text-[#D92128]'
                  : 'text-[#1A1A1A] hover:text-[#D92128]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isActive('/about')
                  ? 'text-[#D92128] border-b-2 border-[#D92128]'
                  : isScrolled
                  ? 'text-[#1A1A1A] hover:text-[#D92128]'
                  : 'text-[#1A1A1A] hover:text-[#D92128]'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/shop"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isActive('/shop')
                  ? 'text-[#D92128] border-b-2 border-[#D92128]'
                  : isScrolled
                  ? 'text-[#1A1A1A] hover:text-[#D92128]'
                  : 'text-[#1A1A1A] hover:text-[#D92128]'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/custom-kits"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isActive('/custom-kits')
                  ? 'text-[#D92128] border-b-2 border-[#D92128]'
                  : isScrolled
                  ? 'text-[#1A1A1A] hover:text-[#D92128]'
                  : 'text-[#1A1A1A] hover:text-[#D92128]'
              }`}
            >
              Custom Kits
            </Link>
            <Link
              to="/support"
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                isActive('/support')
                  ? 'text-[#D92128] border-b-2 border-[#D92128]'
                  : isScrolled
                  ? 'text-[#1A1A1A] hover:text-[#D92128]'
                  : 'text-[#1A1A1A] hover:text-[#D92128]'
              }`}
            >
              Support
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative bg-white border border-gray-200 p-2 rounded-full hover:bg-gray-50"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-5 h-5 text-[#1A1A1A]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#D92128] text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              to="/contact"
              className="bg-[#D92128] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#b91a20] transition-colors"
            >
              Get a Quote
            </Link>
            <a
              href="https://t.me/dinksportw"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0088cc] p-2 rounded-full hover:bg-[#007ab8] transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5 text-white" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#1A1A1A] hover:bg-gray-100"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pt-4">
            <div className="rounded-xl bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 p-4 flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg border border-gray-200 bg-white text-base font-medium ${
                  isActive('/') ? 'text-[#D92128]' : 'text-[#1A1A1A]'
                } hover:bg-gray-100`}
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg border border-gray-200 bg-white text-base font-medium ${
                  isActive('/about') ? 'text-[#D92128]' : 'text-[#1A1A1A]'
                } hover:bg-gray-100`}
              >
                About Us
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg border border-gray-200 bg-white text-base font-medium ${
                  isActive('/shop') ? 'text-[#D92128]' : 'text-[#1A1A1A]'
                } hover:bg-gray-100`}
              >
                Shop
              </Link>
              <Link
                to="/custom-kits"
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg border border-gray-200 bg-white text-base font-medium ${
                  isActive('/custom-kits') ? 'text-[#D92128]' : 'text-[#1A1A1A]'
                } hover:bg-gray-100`}
              >
                Custom Kits
              </Link>
              <Link
                to="/support"
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded-lg border border-gray-200 bg-white text-base font-medium ${
                  isActive('/support') ? 'text-[#D92128]' : 'text-[#1A1A1A]'
                } hover:bg-gray-100`}
              >
                Support
              </Link>

              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={() => {
                    setCartOpen(true);
                    setMobileOpen(false);
                  }}
                  className="flex-1 inline-flex items-center justify-center border border-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart {itemCount > 0 ? `(${itemCount})` : ''}
                </button>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 inline-flex items-center justify-center bg-[#D92128] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#b91a20]"
                >
                  Get a Quote
                </Link>
                <a
                  href="https://t.me/dinksportw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0088cc] p-2 rounded-full hover:bg-[#007ab8]"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;
