import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'What sizes do you offer, and how do I choose the right fit?',
      answer:
        'Yes — we typically offer standard sizes from S to XL. If you find yourself between sizes, you may prefer choosing the larger size for a slightly roomier, more comfortable fit. For team or custom-kit orders we can usually help confirm measurements before production and recommend the best size range based on your preferences.',
    },
    {
      question: 'What materials are your jerseys made from?',
      answer:
        'Our jerseys are typically made from high-performance polyester blends. These fabrics are generally breathable, moisture-wicking, and designed to hold up to frequent use and washing. Exact fabric compositions may vary by product, and we can share specifics on request.',
    },
    {
      question: 'What is the minimum order quantity for custom kits?',
      answer:
        'Our minimum order quantity for custom kits is usually 10 pieces. This helps keep production efficient while still accommodating smaller teams; in some cases exceptions may be possible—please contact us to discuss special requests.',
    },
    {
      question: 'How long does it take to produce custom kits?',
      answer:
        'Production for most standard or small custom orders typically takes around 4 days from final design approval for ready-made or simple orders. Larger runs, complex customizations, or orders requiring samples and approvals may take longer—allow extra lead time and check with our team for an estimated schedule.',
    },
    {
      question: 'Can you match specific team colors?',
      answer:
        'Yes — we can usually match specific team colors. We often use Pantone or similar color-matching systems to keep branding consistent across kits and accessories, but please note that exact matches can sometimes vary slightly depending on material and printing method.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept cash, mobile banking, and Tele birr. Other payment options may be available upon request—contact us if you need an alternative payment method for your order.',
    },
    {
      question: 'What printing or decoration methods do you offer?',
      answer:
        'We commonly offer sublimation, DTF (Direct-to-Film), and embroidery. Each method has different strengths—sublimation is great for full-colour, all-over prints; DTF works well for vibrant transfers on many fabrics; embroidery provides a durable, textured finish for logos. We can recommend the best method based on your design and fabric.',
    },
    {
      question: 'What is your returns or exchange policy?',
      answer:
        'We generally offer exchanges rather than refunds. Exchanges are usually handled on a case-by-case basis depending on the item condition and reason for exchange—please contact customer support to confirm eligibility and arrange an exchange.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full flex justify-center py-12 bg-transparent">
      <div className="w-full max-w-xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-2 text-center"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Frequently Asked Questions
        </h2>
        <p className="mb-6 text-base text-gray-600 text-center">
          Find answers to common questions about our products and services
        </p>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-[#1A1A1A] pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#D92128] flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-4 text-gray-600 leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <h3
            className="text-lg font-semibold text-[#1A1A1A] mb-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Still Have Questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Can't find the answer you're looking for? Our team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center bg-[#D92128] text-white px-6 py-2 rounded-full font-medium hover:bg-[#b91a20] transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen pt-20 bg-[#F4F4F4]">
      <FAQSection />
    </div>
  );
}
