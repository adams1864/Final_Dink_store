import { Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const WhatsAppButton = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/checkout')) {
    return null;
  }

  return (
    <a
      href="https://t.me/dinksportw"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-telegram fixed bottom-6 right-6 z-50 bg-[#0088cc] text-white p-4 rounded-full shadow-lg hover:bg-[#007ab8] transition-all duration-300 hover:scale-110 animate-bounce"
      aria-label="Chat on Telegram"
    >
      <Send className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;
