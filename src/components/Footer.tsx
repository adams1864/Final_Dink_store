import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Send, Youtube } from 'lucide-react';
import { brandLogo } from '../assets';
import { SITE, phoneTelLink } from '../config/site';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={brandLogo}
                alt={SITE.name}
                className="h-10 w-10 object-contain rounded bg-white/10 p-0.5"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold">{SITE.name}</span>
                <span className="text-xs -mt-1 text-gray-400">{SITE.tagline.toUpperCase()}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">Shop online. Delivered across Ethiopia.</p>
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
                <Link to="/support" className="text-sm text-gray-400 hover:text-[#D92128] transition-colors">
                  Support
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
              Logistics
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {SITE.deliveryCities.map((city) => (
                <li key={city.name}>{city.name}</li>
              ))}
            </ul>
            <Link to="/support" className="inline-block mt-3 text-sm text-[#D92128] hover:underline">
              Delivery details →
            </Link>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {SITE.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phoneTelLink(phone)}`} className="hover:text-[#D92128] transition-colors">
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-[#D92128] transition-colors break-all">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D92128] transition-colors inline-flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram
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
          <p className="text-sm text-gray-400">© 2026 {SITE.name}. Proudly Ethiopian.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-gray-500">Telebirr</span>
            <span className="text-xs text-gray-500">Chapa</span>
            <span className="text-xs text-gray-500">Mobile Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
