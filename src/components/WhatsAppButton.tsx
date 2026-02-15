import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';

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
      href="https://t.me/dinksportw"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#0088cc] text-white p-4 rounded-full shadow-lg hover:bg-[#007ab8] transition-all duration-300 hover:scale-110 animate-bounce"
      aria-label="Chat on Telegram"
    >
      <Send className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;
