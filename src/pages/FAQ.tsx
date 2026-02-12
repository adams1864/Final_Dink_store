import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What sizes do you offer, and how do I choose the right fit?',
      answer:
        'Most jerseys are available in standard sizes from S to XL. If you are between sizes, we recommend choosing the larger size for a more comfortable fit. For team or custom-kit orders, our support team can help confirm sizing before production.',
    },
    {
      question: 'What materials are your jerseys made from?',
      answer:
        'Our jerseys are made with lightweight, breathable performance fabric designed for comfort and durability. Material details may vary by design, but we prioritize sweat-friendly and long-lasting sportswear quality.',
    },
    {
      question: 'Do you offer custom kits for teams? What is the minimum order quantity?',
      answer:
        'Yes. We support custom kits for teams, schools, and organizations. The minimum order quantity is 3 pieces per item. For larger team orders, contact us for design support and bulk pricing.',
    },
    {
      question: 'How long does production and delivery take?',
      answer:
        'Ready products are processed quickly, while custom orders require additional production time. Delivery timing depends on your location and order size. You will receive confirmation and status updates after checkout.',
    },
    {
      question: 'Which payment methods do you accept?',
      answer:
        'We currently support online payment through Chapa on checkout. Once payment is confirmed, your order status is updated automatically and a downloadable receipt is generated.',
    },
    {
      question: 'Do you deliver outside Addis Ababa? What are the delivery costs?',
      answer:
        'Yes, we can serve customers outside Addis Ababa depending on location coverage. Delivery pricing may vary by destination and order size. Final shipping details are shared during checkout confirmation.',
    },
    {
      question: 'Can customers return or exchange items? What is the return policy?',
      answer:
        'Returns or exchanges are reviewed case-by-case based on item condition and order type. For issues with size, defects, or delivery, contact support as soon as possible with your order number.',
    },
    {
      question: 'Are bulk discounts available for teams or organizations?',
      answer:
        'Yes. We provide bulk pricing for qualified team and organization orders. Share your quantity and design requirements, and we will provide a tailored quote.',
    },
    {
      question: 'How can customers contact support (phone, Telegram, email)?',
      answer:
        'You can contact us through the Contact page on this website. If you already placed an order, include your order number so we can help you faster with payment, delivery, or receipt requests.',
    },
    {
      question: 'Do you offer sponsorship or partnership packages for clubs?',
      answer:
        'We are open to sponsorship and partnership discussions for clubs, academies, and communities. Send your proposal and audience details via our Contact page for review.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-20 bg-[#F4F4F4]">
      <div className="bg-white border-b-4 border-[#D92128] py-14">
        <div className="container mx-auto px-6 text-center text-[#1A1A1A]">
          <h1
            className="text-3xl md:text-5xl font-bold uppercase mb-3"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Find answers to common questions about our products and services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <p className="text-sm text-gray-500 mb-6 text-center">
          Last updated: February 2026
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#1A1A1A] pr-4">{faq.question}</span>
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
                <div className="px-6 pb-5 text-gray-600 leading-relaxed text-[15px]">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
          <h2
            className="text-2xl font-bold text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Still Have Questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#D92128] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#b91a20] transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
