import { useState } from 'react';
import { CheckCircle, Upload } from 'lucide-react';
import { createMessage, uploadImage } from '../services/api';

const CustomKits = () => {
  const [formData, setFormData] = useState({
    teamName: '',
    quantity: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
    logoFile: null as File | null,
  });

  const [status, setStatus] = useState<{ ok: boolean | null; message: string }>({ ok: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus({ ok: null, message: 'Submitting…' });
      let logoUrl: string | undefined;

      if (formData.logoFile) {
        const upload = await uploadImage(formData.logoFile, 'dink_sports/messages');
        logoUrl = upload.url;
      }

      await createMessage({
        type: 'quote',
        name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || '',
        teamName: formData.teamName,
        quantity: Number(formData.quantity),
        logoUrl,
      });

      setStatus({ ok: true, message: 'Request sent successfully. We will contact you soon.' });
    } catch (err: any) {
      setStatus({ ok: false, message: err?.message || 'Something went wrong. Please try again.' });
    }
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
            Your Team. Your Identity.
          </h1>
          <p className="text-xl text-gray-700">
            Custom team kits designed to perfection
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2
            className="text-4xl font-bold text-center text-[#1A1A1A] mb-16"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#D92128] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Consult</h3>
              <p className="text-gray-600">
                Share your vision, team colors, and design preferences with our team.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#D92128] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Design</h3>
              <p className="text-gray-600">
                Receive professional 3D mockups and digital previews of your kit.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#D92128] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Sample</h3>
              <p className="text-gray-600">
                Approve the physical prototype before we begin bulk production.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#D92128] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Production</h3>
              <p className="text-gray-600">
                We manufacture your custom kits with precision and quality control.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F4F4F4]">
        <div className="container mx-auto px-6">
          <h2
            className="text-4xl font-bold text-center text-[#1A1A1A] mb-12"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#D92128] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1A1A1A] mb-1">Custom Logos</h4>
                <p className="text-gray-600 text-sm">High-quality embroidery or sublimation printing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#D92128] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1A1A1A] mb-1">Color Matching</h4>
                <p className="text-gray-600 text-sm">Exact Pantone color matching available</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#D92128] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1A1A1A] mb-1">Player Names</h4>
                <p className="text-gray-600 text-sm">Individual names and numbers included</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#D92128] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1A1A1A] mb-1">Size Range</h4>
                <p className="text-gray-600 text-sm">Full size range from youth to adult XXL</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#D92128] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1A1A1A] mb-1">Fast Turnaround</h4>
                <p className="text-gray-600 text-sm">4-6 weeks from approval to delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#D92128] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#1A1A1A] mb-1">Low MOQ</h4>
                <p className="text-gray-600 text-sm">Minimum order of just 10 units</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2
            className="text-4xl font-bold text-center text-[#1A1A1A] mb-12"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Request Your Custom Kit Quote
          </h2>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (Min 10) *
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Details & Requirements
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your design vision, color preferences, and any special requirements..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Logo (Optional)
              </label>
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D92128] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, logoFile: file });
                    }}
                  />
                </div>
                {formData.logoFile && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {formData.logoFile.name}</p>
                )}
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D92128] text-white py-4 rounded-lg font-medium hover:bg-[#b91a20] transition-colors"
            >
              Submit Inquiry
            </button>
            {status.message && (
              <p className={`mt-4 text-sm ${status.ok === false ? 'text-red-600' : status.ok === true ? 'text-green-600' : 'text-gray-600'}`}>
                {status.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default CustomKits;
