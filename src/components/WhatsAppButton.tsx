import { useEffect, useState } from 'react';
import { SITE } from '../config/site';
import { brandLogo } from '../assets';

const WhatsAppButton = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function onOpen() {
      setHidden(true);
    }
    function onClose() {
      setHidden(false);
    }

    window.addEventListener('cart:open', onOpen as EventListener);
    window.addEventListener('cart:close', onClose as EventListener);

    return () => {
      window.removeEventListener('cart:open', onOpen as EventListener);
      window.removeEventListener('cart:close', onClose as EventListener);
    };
  }, []);

  if (hidden) return null;

  return (
    <a
      href={SITE.telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#0088cc] text-white p-3 rounded-full shadow-lg hover:bg-[#007ab8] transition-all duration-300 hover:scale-110"
      aria-label="Chat on Telegram"
    >
      <img src={brandLogo} alt="" className="w-8 h-8 object-contain rounded-full bg-white/90 p-0.5" />
    </a>
  );
};

export default WhatsAppButton;
