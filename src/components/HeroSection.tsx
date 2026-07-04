import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import { Link } from "react-router-dom";

import { ArrowRight, Zap } from "lucide-react";



import "swiper/css";

import "swiper/css/effect-fade";

import "swiper/css/pagination";



const HeroSection = ({ heroImages = [] }: { heroImages?: string[] }) => {

  return (

    <section className="relative w-full min-h-[90vh] bg-[#F8F9FA] overflow-hidden pt-20 flex flex-col lg:flex-row">

      

      <div className="absolute inset-0 z-0 opacity-[0.03]" 

           style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}>

      </div>



      <div className="relative z-20 w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:pl-24 lg:pr-12 py-12 order-2 lg:order-1">

        

        <div className="inline-flex items-center gap-2 mb-6">

          <span className="bg-[#D92128] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider skew-x-[-10deg]">

            New Arrivals

          </span>

          <span className="text-[#D92128] text-xs font-bold uppercase tracking-widest">

            2025 Tech Collection

          </span>

        </div>



        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-[#D92128] leading-[0.95] tracking-tight mb-6">

          POWER UP. <br />

          STAY CONNECTED. <br />

          LIVE SMART.

        </h1>



        <p className="text-gray-600 text-lg max-w-md leading-relaxed mb-8">

          Laptops, phones, gaming gear, and more  MYT  brings the latest electronics to your doorstep across Ethiopia.

        </p>



        <div className="flex flex-wrap gap-4">

          <Link

            to="/shop"

            className="group relative px-8 py-4 bg-[#1A1A1A] text-white font-bold uppercase tracking-wide overflow-hidden"

          >

            <span className="relative z-10 flex items-center gap-2">

              Shop Now <ArrowRight size={18} />

            </span>

            <div className="absolute inset-0 bg-[#D92128] transform -translate-x-full skew-x-[-20deg] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>

          </Link>

          

          <Link

            to="/contact"

            className="px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold uppercase tracking-wide hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300"

          >

            Contact Us

          </Link>

        </div>



        <div className="mt-12 flex items-center gap-8 border-t border-gray-200 pt-6">

          <div>

            <p className="text-2xl font-black text-[#1A1A1A]">1000+</p>

            <p className="text-xs text-gray-500 uppercase tracking-wider">Products Listed</p>

          </div>

          <div>

            <p className="text-2xl font-black text-[#1A1A1A]">4 Cities</p>

            <p className="text-xs text-gray-500 uppercase tracking-wider">Delivery Hubs</p>

          </div>

        </div>

      </div>



      <div className="relative w-full lg:w-[60%] h-[500px] lg:h-auto lg:absolute lg:right-0 lg:top-0 lg:bottom-0 order-1 lg:order-2">

        <div 

            className="w-full h-full relative z-10"

            style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }} 

        >

            <style>{`

              @media (max-width: 1024px) {

                div[style*="clipPath"] { clip-path: none !important; }

              }

            `}</style>



            <Swiper

              modules={[Autoplay, EffectFade, Pagination]}

              effect="fade"

              autoplay={{ delay: 3500, disableOnInteraction: false }}

              loop

              className="w-full h-full"

            >

              {heroImages.map((img, idx) => (

                <SwiperSlide key={idx}>

                  <div className="relative w-full h-full">

                    <img src={img} alt="Electronics showcase" className="w-full h-full object-cover" />

                    <div className="absolute inset-0 bg-black/20"></div>

                  </div>

                </SwiperSlide>

              ))}

            </Swiper>

        </div>



        <div className="absolute bottom-10 right-10 z-20 hidden lg:block">

            <div className="bg-white/90 backdrop-blur-md p-4 shadow-2xl border-l-4 border-[#D92128]">

                <div className="flex items-center gap-3">

                    <div className="bg-[#D92128]/10 p-2 rounded-full text-[#D92128]">

                        <Zap size={20} fill="currentColor" />

                    </div>

                    <div>

                        <p className="text-xs font-bold text-gray-500 uppercase">Trending</p>

                        <p className="text-sm font-black text-[#1A1A1A]">HP OMEN Gaming Laptop</p>

                    </div>

                </div>

            </div>

        </div>

      </div>

    </section>

  );

};



export default HeroSection;

