import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiTruck, FiPackage, FiMapPin } from 'react-icons/fi';
import { FREE_SHIPPING_THRESHOLD, DELIVERY_OPTIONS, CONTACT_DETAILS } from '../../constants';

// Retrieve values from site config
const standardDeliveryOption = (DELIVERY_OPTIONS || []).find(opt => opt?.value === 'standard');
const standardDeliveryPrice = standardDeliveryOption?.price || 99;
const standardDeliveryTime = standardDeliveryOption?.days || '3-7 business days';

const sections = [
  { id: 'order-processing', title: '1. Order Processing' },
  { id: 'shipping-within-india', title: '2. Shipping Within India' },
  { id: 'shipping-charges', title: '3. Shipping Charges' },
  { id: 'order-tracking', title: '4. Order Tracking' },
  { id: 'delivery-attempts', title: '5. Delivery Attempts' },
  { id: 'secure-packaging', title: '6. Secure Jewellery Packaging' },
  { id: 'damaged-packages', title: '7. Damaged or Tampered Packages' },
  { id: 'incorrect-address', title: '8. Incorrect or Incomplete Address' },
  { id: 'delayed-shipments', title: '9. Delayed or Lost Shipments' },
  { id: 'international-shipping', title: '10. International Shipping' },
  { id: 'order-cancellation', title: '11. Order Cancellation' },
  { id: 'contact-us', title: '12. Contact Us' },
];

export default function ShippingPolicyPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  // Use Intersection Observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      // Optionally update URL hash without jump
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans w-full overflow-hidden">
      <Helmet>
        <title>Shipping Policy | Tarini Jewellers</title>
        <meta name="description" content="Read Tarini Jewellers' shipping policy. Every Tarini piece is carefully prepared, securely packed and delivered with the attention it deserves." />
      </Helmet>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="pt-24 pb-16 px-5 md:px-10 text-center max-w-[1100px] mx-auto"
      >
        <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-[#A99D95]">
          <Link to="/" className="hover:text-[#B08D57] transition-colors">Home</Link>
          <span className="mx-3">/</span>
          <span className="text-[#25221F]">Shipping Policy</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#25221F] mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Shipping Policy
        </h1>
        <p className="text-[#756A63] text-[15px] md:text-base max-w-2xl mx-auto mb-6 leading-relaxed font-sans italic">
          “Every Tarini piece is carefully prepared, securely packed and delivered with the attention it deserves.”
        </p>
        <p className="text-[#A99D95] text-[13px] font-sans tracking-wide">Last updated: {currentDate}</p>
      </motion.section>

      {/* Quick Info Cards */}
      <section className="px-5 md:px-10 max-w-[1100px] mx-auto mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FiClock, title: 'Order Processing', text: 'Usually dispatched within 1–3 business days.' },
            { icon: FiTruck, title: 'Domestic Delivery', text: 'Delivery usually takes 3–7 business days after dispatch.' },
            { icon: FiPackage, title: 'Secure Packaging', text: 'Every jewellery piece is packed carefully and securely.' },
            { icon: FiMapPin, title: 'Order Tracking', text: 'Tracking details are shared after the order is dispatched.' },
          ].map((card, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-8 border border-[#E8DED1] rounded-sm text-center shadow-sm flex flex-col items-center hover:shadow-md transition-shadow"
            >
              <card.icon className="text-[#B08D57] text-[32px] mb-5 font-light" strokeWidth={1} />
              <h3 className="text-[#25221F] font-medium mb-3 font-sans text-[15px] tracking-wide">{card.title}</h3>
              <p className="text-[#756A63] text-[13px] leading-relaxed font-sans">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="px-5 md:px-10 max-w-[1100px] mx-auto pb-32 flex flex-col md:flex-row gap-12 items-start">
        
        {/* Sticky Sidebar Navigation (Desktop only) */}
        <div className="hidden md:block w-1/3 lg:w-1/4 sticky top-32">
          <div className="bg-white p-8 border border-[#E8DED1] rounded-sm shadow-sm">
            <h4 className="text-[#25221F] font-medium mb-6 uppercase tracking-[0.1em] text-[12px] font-sans border-b border-[#E8DED1] pb-4">On this page</h4>
            <ul className="space-y-4">
              {sections.map(section => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`}
                    onClick={(e) => scrollToSection(e, section.id)}
                    className={`text-[14px] font-sans transition-colors block ${
                      activeSection === section.id 
                        ? 'text-[#B08D57] font-medium' 
                        : 'text-[#756A63] hover:text-[#25221F]'
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-white p-8 md:p-12 lg:p-16 border border-[#E8DED1] rounded-sm shadow-sm space-y-20">
          
          <div id="order-processing" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>1. Order Processing</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>Orders are usually processed within 1–3 business days after successful payment confirmation. Orders placed on Sundays or public holidays will be processed on the next working day.</p>
              <p>During sales, festive periods, new collection launches or periods of high demand, order processing may take slightly longer. Customers will be notified if there is a significant delay.</p>
            </div>
          </div>

          <div id="shipping-within-india" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2. Shipping Within India</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>Tarini Jewellers currently delivers to serviceable locations across India through trusted courier partners.</p>
              <p>Standard delivery usually takes approximately {standardDeliveryTime} after dispatch. Delivery time may vary depending on the customer’s location, courier availability, weather conditions, public holidays or other circumstances beyond our control.</p>
              <p className="font-medium text-[#25221F]">Please note that delivery timelines are estimates and cannot be guaranteed.</p>
            </div>
          </div>

          <div id="shipping-charges" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3. Shipping Charges</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>Shipping charges are displayed clearly during checkout before the customer completes payment.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Standard shipping charge: <span className="font-medium text-[#25221F]">₹{standardDeliveryPrice}</span></li>
                <li>Free shipping on orders above: <span className="font-medium text-[#25221F]">₹{FREE_SHIPPING_THRESHOLD}</span></li>
              </ul>
              <div className="bg-[#FAF7F2] p-5 border border-[#E8DED1] mt-6 italic text-[#25221F] text-center">
                “Complimentary standard shipping is available on all eligible prepaid orders within India.”
              </div>
            </div>
          </div>

          <div id="order-tracking" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>4. Order Tracking</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>Once an order is dispatched, the customer will receive tracking information through the registered email address, mobile number or order account.</p>
              {/* Order tracking button hidden as route does not exist currently */}
            </div>
          </div>

          <div id="delivery-attempts" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>5. Delivery Attempts</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>Customers must provide a complete and accurate delivery address, including the correct PIN code and contact number.</p>
              <p>Courier partners may contact the customer to complete delivery. If delivery fails because of an incorrect address, unavailable recipient or repeated unsuccessful delivery attempts, the order may be returned to Tarini Jewellers.</p>
              <p>Any additional reshipping charge must be communicated to the customer before the parcel is shipped again.</p>
            </div>
          </div>

          <div id="secure-packaging" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>6. Secure Jewellery Packaging</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>Every Tarini Jewellers order must be carefully inspected and packed in secure, protective packaging before dispatch.</p>
              <p>For customer safety, the outer package should not unnecessarily reveal details about the jewellery inside.</p>
              <div className="bg-[#FAF7F2] border-l-[3px] border-[#B08D57] py-4 px-6 mt-6">
                <p className="text-[#25221F] font-medium m-0 tracking-wide text-[14px]">Please do not accept a package that appears opened, damaged or tampered with.</p>
              </div>
            </div>
          </div>

          <div id="damaged-packages" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>7. Damaged or Tampered Packages</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>If a package is damaged, opened or tampered with at the time of delivery, the customer should refuse the delivery whenever possible.</p>
              <p>If the issue is discovered after accepting the parcel, the customer should contact Tarini Jewellers within 24 hours and provide:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Order number</li>
                <li>Photographs of the outer packaging</li>
                <li>Photographs of the received product</li>
                <li>A clear unboxing video showing the sealed parcel being opened</li>
              </ul>
              <p>The case will be reviewed before a replacement or other resolution is approved.</p>
            </div>
          </div>

          <div id="incorrect-address" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>8. Incorrect or Incomplete Address</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>Customers must carefully verify their shipping address before placing an order.</p>
              <p>Address changes can only be requested before dispatch and are subject to confirmation. Once an order has been shipped, Tarini Jewellers may not be able to change the delivery address.</p>
            </div>
          </div>

          <div id="delayed-shipments" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>9. Delayed or Lost Shipments</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>If tracking information has not changed for an unusual period, the customer can contact Tarini Jewellers for assistance.</p>
              <p>Tarini Jewellers will coordinate with the courier partner and provide an update. Any replacement or refund for a confirmed lost shipment will be processed only after the courier investigation is completed.</p>
            </div>
          </div>

          <div id="international-shipping" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>10. International Shipping</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>International shipping is currently unavailable. We are working toward bringing Tarini Jewellers to more destinations.</p>
            </div>
          </div>

          <div id="order-cancellation" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>11. Order Cancellation</h2>
            <div className="text-[#756A63] text-[15px] leading-[1.8] space-y-5 font-sans">
              <p>Orders can only be cancelled before they are dispatched.</p>
              <p>Once an order has been shipped, cancellation will not be possible and the applicable return or exchange policy will apply.</p>
              <p className="mt-4">
                <Link to="/returns" className="text-[#B08D57] hover:text-[#25221F] underline underline-offset-4 transition-colors font-medium">
                  Return and Refund Policy
                </Link>
              </p>
            </div>
          </div>

          <div id="contact-us" className="scroll-mt-32">
            <h2 className="text-3xl text-[#25221F] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12. Contact Us</h2>
            <div className="bg-[#FAF7F2] p-8 md:p-10 border border-[#E8DED1] rounded-sm shadow-sm">
              <p className="text-[#25221F] font-medium mb-8 font-sans text-[16px] leading-[1.6]">
                Need help with your delivery? Please contact our customer-care team and include your order number so we can assist you quickly.
              </p>
              <div className="space-y-4 text-[15px] text-[#756A63]">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="font-medium text-[#25221F] min-w-[120px]">Email:</span>
                  <a href={`mailto:${CONTACT_DETAILS?.email || ''}`} className="hover:text-[#B08D57] transition-colors">{CONTACT_DETAILS?.email || 'Support'}</a>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="font-medium text-[#25221F] min-w-[120px]">Phone/WhatsApp:</span>
                  <a href={`tel:${CONTACT_DETAILS?.phone?.replace(/\s+/g, '') || ''}`} className="hover:text-[#B08D57] transition-colors">{CONTACT_DETAILS?.phone || 'Support'}</a>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="font-medium text-[#25221F] min-w-[120px]">Support Hours:</span>
                  <span>{CONTACT_DETAILS?.hours || 'Standard Business Hours'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
