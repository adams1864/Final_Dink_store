import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { createMessage } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<{ ok: boolean | null; message: string }>({ ok: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus({ ok: null, message: 'Sending…' });
      await createMessage({
        type: 'contact',
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setStatus({ ok: true, message: 'Thank you for contacting us! We will respond shortly.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
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
            Let's Talk Business
          </h1>
          <p className="text-xl text-gray-700">
            Get in touch with our team today
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2
              className="text-3xl font-bold text-[#1A1A1A] mb-8"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#D92128] p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-1">Headquarters</h3>
                  <p className="text-gray-600">
                    4kilo Around Arda Subcity<br />
                    Amroge Chicken Building, 3rd Floor
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#D92128] p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-1">Phone Numbers</h3>
                  <p className="text-gray-600">
                    <a href="tel:+251984888877" className="text-[#D92128] hover:underline">+251 984 888 877</a><br />
                    <a href="tel:+251904391587" className="text-[#D92128] hover:underline">+251 904 39 15 87</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#D92128] p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1A1A] mb-1">Email</h3>
                  <p className="text-gray-600">
                    <a href="mailto:dinksport145@gmail.com" className="text-[#D92128] hover:underline">dinksport145@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3
                className="text-2xl font-bold text-[#1A1A1A] mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Business Hours
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 1:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2
                className="text-2xl font-bold text-[#1A1A1A] mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  />
                </div>

                <div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="wholesale">Wholesale Order</option>
                    <option value="custom">Custom Team Kits</option>
                    <option value="sponsorship">Sponsorship</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D92128] text-white py-3 rounded-lg font-medium hover:bg-[#b91a20] transition-colors"
                >
                  Send Message
                </button>
                {status.message && (
                  <p
                    className={`mt-4 text-sm ${
                      status.ok === false ? 'text-red-600' : status.ok === true ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '400px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.2422540695!2d38.613328!3d8.9806034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Dink Sports Wear Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
