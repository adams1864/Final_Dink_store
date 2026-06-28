import { useState } from 'react';
import { Phone, Send } from 'lucide-react';
import { createMessage } from '../services/api';
import { SITE, phoneTelLink } from '../config/site';
import { brandLogo } from '../assets';
import SupportContactCard from '../components/SupportContactCard';

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
    } catch (err: unknown) {
      setStatus({
        ok: false,
        message: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#F4F4F4]">
      <div className="hero-bg py-16 relative">
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <img src={brandLogo} alt={SITE.name} className="h-16 w-16 object-contain mx-auto mb-4 rounded-lg bg-white/80 p-1" />
          <h1
            className="text-4xl md:text-6xl font-bold uppercase mb-4 text-[#D92128]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Contact {SITE.name}
          </h1>
          <p className="text-xl text-gray-700">Get in touch with our team today</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <SupportContactCard />

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3
                className="text-2xl font-bold text-[#1A1A1A] mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Business Hours
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>{SITE.businessHours.weekdays}</p>
                <p>{SITE.businessHours.saturday}</p>
                <p>{SITE.businessHours.sunday}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={SITE.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0088cc] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#007ab8]"
              >
                <Send className="w-4 h-4" />
                Telegram
              </a>
              {SITE.phones.slice(0, 1).map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phoneTelLink(phone)}`}
                  className="inline-flex items-center gap-2 border border-[#D92128] text-[#D92128] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#D92128] hover:text-white"
                >
                  <Phone className="w-4 h-4" />
                  Call {phone}
                </a>
              ))}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D92128] focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order & Delivery</option>
                    <option value="logistics">Logistics (Ethiopia)</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
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
              title={`${SITE.name} — Addis Ababa`}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
