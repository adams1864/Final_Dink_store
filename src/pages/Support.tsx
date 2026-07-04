import { useState } from 'react';
import { Truck, Factory, Ruler } from 'lucide-react';
import { SITE } from '../config/site';
import SupportContactCard from '../components/SupportContactCard';

type TabType = 'logistics' | 'manufacturing' | 'sizing';

const Support = () => {
  const [activeTab, setActiveTab] = useState<TabType>('logistics');
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');

  const sizingData = {
    cm: [
      { size: 'S', chest: '88-92', length: '68', sleeve: '18' },
      { size: 'M', chest: '96-100', length: '70', sleeve: '19' },
      { size: 'L', chest: '104-108', length: '72', sleeve: '20' },
      { size: 'XL', chest: '112-116', length: '74', sleeve: '21' },
      { size: 'XXL', chest: '120-124', length: '76', sleeve: '22' },
    ],
    inch: [
      { size: 'S', chest: '34.6-36.2', length: '26.8', sleeve: '7.1' },
      { size: 'M', chest: '37.8-39.4', length: '27.6', sleeve: '7.5' },
      { size: 'L', chest: '40.9-42.5', length: '28.3', sleeve: '7.9' },
      { size: 'XL', chest: '44.1-45.7', length: '29.1', sleeve: '8.3' },
      { size: 'XXL', chest: '47.2-48.8', length: '29.9', sleeve: '8.7' },
    ],
  };

  return (
    <div className="min-h-screen pt-20 bg-[#F4F4F4]">
      <div className="hero-bg py-16 relative">
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1
            className="text-4xl md:text-6xl font-bold uppercase mb-4 text-[#D92128]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {SITE.name} Support
          </h1>
          <p className="text-xl text-gray-700">
            Logistics, sizing, and help — delivered across Ethiopia
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <SupportContactCard className="sticky top-24" />
            <div className="bg-white rounded-lg shadow-md p-4">
              <button
                onClick={() => setActiveTab('logistics')}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors flex items-center gap-3 ${
                  activeTab === 'logistics'
                    ? 'bg-[#D92128] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="font-medium">Logistics</span>
              </button>
              <button
                onClick={() => setActiveTab('manufacturing')}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors flex items-center gap-3 ${
                  activeTab === 'manufacturing'
                    ? 'bg-[#D92128] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Factory className="w-5 h-5" />
                <span className="font-medium">Manufacturing</span>
              </button>
              <button
                onClick={() => setActiveTab('sizing')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  activeTab === 'sizing'
                    ? 'bg-[#D92128] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Ruler className="w-5 h-5" />
                <span className="font-medium">Sizing Guide</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {activeTab === 'logistics' && (
                <div>
                  <h2
                    className="text-3xl font-bold text-[#1A1A1A] mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {SITE.logisticsTitle}
                  </h2>
                  <p className="text-gray-600 mb-6">{SITE.logisticsDescription}</p>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                      Delivery cities in Ethiopia
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      {SITE.deliveryCities.map((city) => (
                        <div
                          key={city.name}
                          className="bg-[#F4F4F4] px-5 py-4 rounded-lg border border-gray-200"
                        >
                          <p className="font-bold text-[#1A1A1A]">{city.name}</p>
                          {city.note ? <p className="text-sm text-gray-600 mt-1">{city.note}</p> : null}
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm">
                      Orders are dispatched from Addis Ababa and delivered to the cities above. Contact us on
                      Telegram or phone for exact timing in your area.
                    </p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                      National shipping partners
                    </h3>
                    <div className="flex flex-wrap gap-4 mb-6">
                      {/* <div className="bg-[#F4F4F4] px-6 py-3 rounded-lg font-medium">DHL</div> */}
                      {/* <div className="bg-[#F4F4F4] px-6 py-3 rounded-lg font-medium">FedEx</div> */}
                      <div className="bg-[#F4F4F4] px-6 py-3 rounded-lg font-medium">
                        Ethiopian Airlines Cargo
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFF9E6] border-l-4 border-[#D92128] p-4 rounded">
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> Delivery times are estimates and may vary based on customs clearance and local conditions.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'manufacturing' && (
                <div>
                  <h2
                    className="text-3xl font-bold text-[#1A1A1A] mb-6"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Manufacturing & Sustainability
                  </h2>
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                      Ethical Production
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Our factory in Addis Ababa operates with the highest ethical standards. We are committed to fair wages, safe working conditions, and supporting the local community.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#F4F4F4] p-4 rounded-lg">
                        <h4 className="font-bold text-[#1A1A1A] mb-2">Fair Wages</h4>
                        <p className="text-sm text-gray-600">
                          All workers receive above minimum wage with benefits
                        </p>
                      </div>
                      <div className="bg-[#F4F4F4] p-4 rounded-lg">
                        <h4 className="font-bold text-[#1A1A1A] mb-2">Safe Conditions</h4>
                        <p className="text-sm text-gray-600">
                          Modern facility with safety protocols and regular audits
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                      Sustainable Fabrics
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      We are increasingly incorporating recycled and eco-friendly materials into our product lines.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Recycled polyester options available</li>
                      <li>Water-efficient dyeing processes</li>
                      <li>Minimal waste production methods</li>
                      <li>Biodegradable packaging materials</li>
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-[#F4F4F4] px-6 py-3 rounded-lg font-medium">
                        ISO 9001
                      </div>
                      <div className="bg-[#F4F4F4] px-6 py-3 rounded-lg font-medium">
                        OEKO-TEX
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sizing' && (
                <div>
                  <h2
                    className="text-3xl font-bold text-[#1A1A1A] mb-6"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Sizing Guide
                  </h2>
                  <div className="mb-6 flex justify-end">
                    <div className="inline-flex rounded-lg border border-gray-300">
                      <button
                        onClick={() => setUnit('cm')}
                        className={`px-6 py-2 font-medium rounded-l-lg transition-colors ${
                          unit === 'cm'
                            ? 'bg-[#D92128] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        CM
                      </button>
                      <button
                        onClick={() => setUnit('inch')}
                        className={`px-6 py-2 font-medium rounded-r-lg transition-colors ${
                          unit === 'inch'
                            ? 'bg-[#D92128] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        INCH
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto mb-8">
                    <table className="w-full">
                      <thead className="bg-[#F4F4F4]">
                        <tr>
                          <th className="px-4 py-3 text-left font-bold text-[#1A1A1A]">Size</th>
                          <th className="px-4 py-3 text-left font-bold text-[#1A1A1A]">Chest</th>
                          <th className="px-4 py-3 text-left font-bold text-[#1A1A1A]">Length</th>
                          <th className="px-4 py-3 text-left font-bold text-[#1A1A1A]">Sleeve</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sizingData[unit].map((row) => (
                          <tr key={row.size}>
                            <td className="px-4 py-3 font-bold text-[#D92128]">{row.size}</td>
                            <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                            <td className="px-4 py-3 text-gray-600">{row.length}</td>
                            <td className="px-4 py-3 text-gray-600">{row.sleeve}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-[#F4F4F4] p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-4">How to Measure</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>
                        <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal
                      </li>
                      <li>
                        <strong>Length:</strong> Measure from the highest point of the shoulder to the bottom hem
                      </li>
                      <li>
                        <strong>Sleeve:</strong> Measure from the shoulder seam to the end of the sleeve
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
