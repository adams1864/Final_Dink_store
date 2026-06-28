import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { SITE, phoneTelLink } from '../config/site';
import { brandLogo } from '../assets';

export default function SupportContactCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-6">
        <img src={brandLogo} alt={SITE.name} className="h-14 w-14 object-contain rounded-lg bg-gray-50 p-1" />
        <div>
          <h3 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {SITE.name}
          </h3>
          <p className="text-sm text-gray-500">{SITE.tagline}</p>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-[#D92128] mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-[#1A1A1A] mb-1">Phone (Silk)</p>
            <div className="flex flex-col gap-1">
              {SITE.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phoneTelLink(phone)}`}
                  className="text-[#D92128] hover:underline"
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-[#D92128] mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-[#1A1A1A] mb-1">Gmail</p>
            <a href={`mailto:${SITE.email}`} className="text-[#D92128] hover:underline break-all">
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Send className="w-5 h-5 text-[#D92128] mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-[#1A1A1A] mb-1">Telegram</p>
            <a
              href={SITE.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D92128] hover:underline"
            >
              {SITE.telegramHandle}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#D92128] mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-[#1A1A1A] mb-1">{SITE.logisticsTitle}</p>
            <ul className="text-gray-600 space-y-1">
              {SITE.deliveryCities.map((city) => (
                <li key={city.name}>
                  {city.name}
                  {city.note ? <span className="text-gray-400"> — {city.note}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
