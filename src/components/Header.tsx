import { useState, useEffect } from 'react';
import { brandLogo } from '../assets';
import { SITE } from '../config/site';
import { Link, useLocation } from 'react-router-dom';
import { Send, Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartDrawer from './CartDrawer';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();
  const { user, logout } = useAuth();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isCustomer = user?.role === 'customer';

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
              src={brandLogo}
              alt={SITE.name}
              className="h-12 w-12 object-contain rounded-md"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                MYT
              </span>
              <span className="text-xs text-[#1A1A1A] -mt-1">{SITE.tagline.toUpperCase()}</span>
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
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center justify-center rounded-full border border-gray-200 bg-white/90 px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#D92128] text-white text-[11px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {isCustomer ? (
              <div className="flex items-center gap-2">
                <span className="hidden lg:inline text-sm text-gray-700 max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-gray-100"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-flex rounded-full border border-[#D92128] text-[#D92128] px-3 py-2 text-sm font-medium hover:bg-[#D92128] hover:text-white transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
            <Link
              to="/contact"
              className="bg-[#D92128] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#b91a20] transition-colors"
            >
              Get a Quote
            </Link>
            <a
              href={SITE.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0088cc] p-2 rounded-full hover:bg-[#007ab8] transition-colors"
              aria-label="Telegram"
            >
              <Send className="w-5 h-5 text-white" />
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex items-center justify-center p-2 rounded-md text-[#1A1A1A] hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#D92128] text-white text-[10px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-[#1A1A1A] hover:bg-gray-100"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setCartOpen(true);
                }}
                className={`px-3 py-2 rounded-lg border border-gray-200 bg-white text-base font-medium flex items-center justify-between ${
                  isActive('/cart') ? 'text-[#D92128]' : 'text-[#1A1A1A]'
                } hover:bg-gray-100`}
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="min-w-6 h-6 px-2 rounded-full bg-[#D92128] text-white text-xs font-semibold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {isCustomer ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void logout();
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-base font-medium text-[#1A1A1A] hover:bg-gray-100 text-left"
                >
                  Logout ({user.name || user.email})
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-base font-medium text-center text-[#1A1A1A] hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-lg border border-[#D92128] bg-white text-base font-medium text-center text-[#D92128] hover:bg-[#D92128] hover:text-white"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-3 pt-3">
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 inline-flex items-center justify-center bg-[#D92128] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#b91a20]"
                >
                  Get a Quote
                </Link>
                <a
                  href={SITE.telegramUrl}
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
