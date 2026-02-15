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
      answer: 'Most jerseys are available in standard sizes from S to XL. If you are between sizes, we recommend choosing the larger size for a more comfortable fit. For team or custom-kit orders, our support team can help confirm sizing before production.',
    },
    {
      question: 'What materials are your jerseys made from?',
      answer: 'We use high-performance polyester blends designed for sport. The fabric is breathable, moisture-wicking, and durable for frequent use and washing.',
    },
    {
      question: 'What is the minimum order quantity for custom kits?',
      answer: 'Our minimum order quantity (MOQ) for custom team kits is 10 units. This keeps production efficient while still supporting smaller teams.',
    },
    {
      question: 'How long does it take to produce custom kits?',
      answer: 'Custom kit production typically takes 4 to 6 weeks from design approval to delivery, including mockups, sample approval, and production.',
    },
    {
      question: 'Can you match specific team colors?',
      answer: 'Yes. We can match Pantone colors to keep your team branding consistent across kits and accessories.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfer, major cards, and local options such as Telebirr for Ethiopian customers.',
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
