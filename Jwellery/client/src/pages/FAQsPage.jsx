import { Helmet } from 'react-helmet-async';
const faqs = [
  { q: 'How do I track my order?', a: 'Visit My Orders in your account to track your shipment in real-time.' },
  { q: 'What is your return policy?', a: 'We offer 7-day hassle-free returns. Items must be in original packaging.' },
  { q: 'Are your products BIS hallmarked?', a: 'Yes! All our gold and silver jewelry is BIS hallmarked for guaranteed purity.' },
  { q: 'What payment methods do you accept?', a: 'We accept Razorpay (UPI, Cards, Net Banking), Stripe, and Cash on Delivery.' },
  { q: 'How long does delivery take?', a: 'Standard: 5-7 business days. Express: 2-3 business days.' },
  { q: 'Can I customize jewelry?', a: 'Yes! Contact us for custom jewelry orders.' },
];
export default function FAQsPage() {
  return (
    <>
      <Helmet><title>FAQs — Jwellery</title></Helmet>
      <div className="container-luxury py-16 max-w-3xl">
        <h1 className="font-serif text-4xl text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="border border-gray-100 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-600 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
