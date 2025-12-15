import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import logo from '../assets/logo1.png';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={logo}
                alt="Dink Sports Wear"
                className="h-10 w-10 object-contain brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold">dink</span>
                <span className="text-xs -mt-1">SPORTS WEAR</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">Move with Purpose.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-[#D92128] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-sm text-gray-400 hover:text-[#D92128] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/custom-kits" className="text-sm text-gray-400 hover:text-[#D92128] transition-colors">
                  Custom Kits
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-[#D92128] transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-gray-400 hover:text-[#D92128] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-[#D92128] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-[#D92128] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>4kilo Around Arda Subcity, Amroge Chicken Building, 3rd Floor</li>
              <li>
                <a href="tel:+251984888877" className="hover:text-[#D92128] transition-colors">
                  +251 984 888 877
                </a>
              </li>
              <li>
                <a href="tel:+251904391587" className="hover:text-[#D92128] transition-colors">
                  +251 904 39 15 87
                </a>
              </li>
              <li>
                <a href="mailto:dinksport145@gmail.com" className="hover:text-[#D92128] transition-colors">
                  dinksport145@gmail.com
                </a>
              </li>
            </ul>
            <div className="flex space-x-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#D92128] transition-colors group"
              >
                <Instagram className="w-4 h-4 text-[#1A1A1A] group-hover:text-white" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#D92128] transition-colors group"
              >
                <Facebook className="w-4 h-4 text-[#1A1A1A] group-hover:text-white" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#D92128] transition-colors group"
              >
                <Linkedin className="w-4 h-4 text-[#1A1A1A] group-hover:text-white" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#D92128] transition-colors group"
              >
                <Youtube className="w-4 h-4 text-[#1A1A1A] group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row sm:flex-wrap md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 Dink Sports Wear. Proudly Ethiopian.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-gray-500">Visa</span>
            <span className="text-xs text-gray-500">Mastercard</span>
            <span className="text-xs text-gray-500">Telebirr</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
