import { Award, Heart, Target } from 'lucide-react';
import image5 from '../assets/image5.jpg';
import { FAQSection } from './FAQ';
const About = () => {
  return (
    <div className="min-h-screen pt-20">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden hero-bg">
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="relative z-10 text-center">
          <h1
            className="text-5xl md:text-7xl font-bold uppercase mb-4 text-[#D92128]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Born in the Land of Runners
          </h1>
          <p className="text-xl max-w-2xl mx-auto px-6 text-gray-700">
            Where heritage meets innovation in every stitch
          </p>
        </div>
      </section>
      <section className="py-24 bg-white relative overflow-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #1A1A1A 25%, transparent 25%, transparent 50%, #1A1A1A 50%, #1A1A1A 75%, transparent 75%, transparent 100%)',
            backgroundSize: '20px 20px',
          }}
        ></div>
        <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/2 w-full h-full bg-[#D92128] opacity-10 transform -skew-x-12 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="md:order-1 md:px-6 md:mx-auto max-w-[640px] md:flex md:flex-col md:justify-center">
              <div className="inline-block bg-[#D92128] h-1 w-16 mb-4"></div>
              <h2 className="text-5xl font-extrabold text-[#1A1A1A] mb-8 uppercase tracking-tight leading-none">
                Our Story
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed font-medium">
                Founded in Addis Ababa, <span className="text-[#D92128] font-bold">Dink Sports Wear</span> combines Ethiopian resilience with modern textile technology.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Born from a vision to create world-class sportswear in the heart of Africa, we've grown from a small workshop to an international supplier. Inspired by legends, powered by excellence.
              </p>
              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                <div>
                  <span className="block text-3xl font-bold text-[#1A1A1A]">100%</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wider">Ethiopian Craft</span>
                </div>
                <div>
                  <span className="block text-3xl font-bold text-[#1A1A1A]">Global</span>
                  <span className="text-sm text-gray-500 uppercase tracking-wider">Reach</span>
                </div>
              </div>
            </div>

            <div className="md:order-2 md:px-6 md:pl-0">
              <div className="flex md:justify-end">
                <div className="relative w-[500px] h-[500px] lg:h-[650px]">
                <img
                  src={image5}
                  alt="Our Workshop"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl"
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEW "ROSTER STYLE" JOURNEY SECTION ================= */}
      <section className="py-24 bg-[#111111] text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-800 pb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
                Legacy in Motion
              </h2>
              <p className="text-gray-400 text-lg">From Addis Ababa to the World Stage.</p>
            </div>
            <div className="hidden md:block">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-[#D92128]"></div>
                <div className="w-3 h-3 bg-gray-600"></div>
                <div className="w-3 h-3 bg-gray-800"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative h-[420px] bg-[#1A1A1A] border border-gray-800 overflow-hidden hover:border-[#D92128] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-[#D92128] to-[#1A1A1A] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div
                  className="text-6xl md:text-7xl font-black text-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ WebkitTextStroke: '2px #555', color: 'transparent' }}
                >
                  '20
                </div>
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-1 bg-[#D92128] mb-4 w-0 group-hover:w-12 transition-all duration-500"></div>
                  <h3 className="text-2xl font-bold text-white mb-3">The Vision</h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200">
                    Founded with a singular mission: to bring Ethiopian craftsmanship to the global sports industry.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative h-[420px] bg-[#1A1A1A] border border-gray-800 overflow-hidden hover:border-[#D92128] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-[#D92128] to-[#1A1A1A] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div
                  className="text-6xl md:text-7xl font-black text-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ WebkitTextStroke: '2px #555', color: 'transparent' }}
                >
                  '22
                </div>
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-1 bg-[#D92128] mb-4 w-0 group-hover:w-12 transition-all duration-500"></div>
                  <h3 className="text-2xl font-bold text-white mb-3">First Factory</h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200">
                    Opened our state-of-the-art manufacturing facility in Addis Ababa, employing local talent.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative h-[420px] bg-[#1A1A1A] border border-gray-800 overflow-hidden hover:border-[#D92128] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-[#D92128] to-[#1A1A1A] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div
                  className="text-6xl md:text-7xl font-black text-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ WebkitTextStroke: '2px #555', color: 'transparent' }}
                >
                  '23
                </div>
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-1 bg-[#D92128] mb-4 w-0 group-hover:w-12 transition-all duration-500"></div>
                  <h3 className="text-2xl font-bold text-white mb-3">Expansion</h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200">
                    Began exporting to regional teams and clubs across Africa, Europe, and the Middle East.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative h-[420px] bg-[#D92128] border border-[#D92128] overflow-hidden shadow-lg shadow-red-900/50">
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}
              ></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div className="text-5xl md:text-6xl font-black text-white opacity-100">NOW</div>
                <div>
                  <div className="w-12 h-1 bg-white mb-4"></div>
                  <h3 className="text-2xl font-bold text-white mb-3">Global Export</h3>
                  <p className="text-white text-sm leading-relaxed font-medium">
                    Serving hundreds of teams worldwide with custom kits and premium sportswear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2
            className="text-4xl font-bold text-center text-[#1A1A1A] mb-16"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-[#D92128]">
              <div className="bg-[#D92128] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3
                className="text-2xl font-bold text-[#1A1A1A] mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Performance
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Fabric that breathes. Every material is carefully selected for durability, comfort, and performance under pressure.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-[#D92128]">
              <div className="bg-[#D92128] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3
                className="text-2xl font-bold text-[#1A1A1A] mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Heritage
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Inspired by champions. Drawing from Ethiopia's rich athletic legacy, we honor the spirit of perseverance in every design.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-[#D92128]">
              <div className="bg-[#D92128] w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3
                className="text-2xl font-bold text-[#1A1A1A] mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Integrity
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Ethical production. Fair wages, safe working conditions, and sustainable practices are non-negotiable for us.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#1A1A1A] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2
            className="text-4xl font-bold mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Be Part of Our Story
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the global movement of teams and athletes who choose excellence.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#D92128] text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-[#b91a20] transition-all duration-300 transform hover:scale-105"
          >
            Partner With Us
          </a>
        </div>
      </section>

      {/* FAQ Section below about content */}
      <FAQSection />
    </div>
  );
};

export default About;
