import { Link } from 'react-router-dom';
// Swiper is used inside the HeroSection component; no direct imports needed here
import football3 from '../assets/football3.jpg';
import football2 from '../assets/football2.jpg';
import football from '../assets/football.jpg';
import football1 from '../assets/football1.jpg';
import kits from '../assets/kits.jpg';
import image4 from '../assets/image4.jpg';
import { Flag, Globe, Plane, Droplet, Wind, Shield } from 'lucide-react';

import HeroSection from '../components/HeroSection';

// (Removed unused WingLineArt - not needed when HeroSection provides decorations)

const Home = () => {
  const heroImages: string[] = [football3, football2, football];

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
    </div>
  );
};

export default Home;
