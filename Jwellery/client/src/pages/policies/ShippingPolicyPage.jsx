import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-[#1A1512] min-h-screen font-sans selection:bg-[#C6A15B]/30 selection:text-[#E8E1D6]">
      <Helmet>
        <title>Shipping Policy | TARINI Fine Jewellery</title>
        <meta name="description" content="Read TARINI's shipping policy. Every TARINI piece is carefully prepared, securely packed and delivered." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-28 pb-16 px-6 text-center max-w-[900px] mx-auto">
        <div className="mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C6A15B]">
          Customer Care
        </div>
        <h1 className="text-[40px] md:text-[56px] text-[#E8E1D6] mb-6 tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Shipping Policy
        </h1>
        <p className="text-[#8A8177] text-[15px] md:text-[17px] max-w-xl mx-auto italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "Every TARINI piece is carefully prepared, securely packed, and delivered with the attention it deserves."
        </p>
        <p className="text-[#8A8177]/60 text-[12px] font-sans tracking-wide mt-6">Last updated: {currentDate}</p>
        
        {/* Gradient Divider */}
        <div className="w-full max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/40 to-transparent mt-12"></div>
      </section>

      {/* Main Content Layout */}
      <section className="px-6 pb-24 flex flex-col md:flex-row gap-12 items-start max-w-[1100px] mx-auto">
        
        {/* Sticky Sidebar Navigation (Desktop only) */}
        <div className="hidden md:block w-1/3 lg:w-1/4 sticky top-32">
          <div className="pr-8 border-r border-[#C6A15B]/20">
            <h4 className="text-[#C6A15B] font-medium mb-6 uppercase tracking-[0.1em] text-[11px] font-sans pb-4">On this page</h4>
            <ul className="space-y-4">
              {sections.map(section => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`}
                    onClick={(e) => scrollToSection(e, section.id)}
                    className={`text-[13px] font-sans transition-colors block ${
                      activeSection === section.id 
                        ? 'text-[#E4C989] font-medium' 
                        : 'text-[#8A8177] hover:text-[#E8E1D6]'
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
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-16">
          
          <div id="order-processing" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">1. Order Processing</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Orders are usually processed within 1–3 business days after successful payment confirmation. Orders placed on Sundays or public holidays will be processed on the next working day.</p>
              <p>During sales, festive periods, new collection launches or periods of high demand, order processing may take slightly longer. Customers will be notified if there is a significant delay.</p>
            </div>
          </div>

          <div id="shipping-within-india" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">2. Shipping Within India</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>TARINI currently delivers to serviceable locations across India through trusted premium courier partners.</p>
              <p>Standard delivery usually takes approximately {standardDeliveryTime} after dispatch. Delivery time may vary depending on the customer’s location, courier availability, weather conditions, public holidays, or other circumstances beyond our control.</p>
              <p className="font-medium text-[#E8E1D6]">Please note that delivery timelines are estimates and cannot be guaranteed.</p>
            </div>
          </div>

          <div id="shipping-charges" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">3. Shipping Charges</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Shipping charges are displayed clearly during checkout before the customer completes payment.</p>
              <ul className="list-disc pl-5 space-y-2 text-[#E8E1D6]/80">
                <li>Standard shipping charge: <span className="font-medium text-[#E8E1D6]">₹{standardDeliveryPrice}</span></li>
                <li>Free shipping on orders above: <span className="font-medium text-[#E8E1D6]">₹{FREE_SHIPPING_THRESHOLD}</span></li>
              </ul>
              <div className="p-5 border-l-[2px] border-[#C6A15B] mt-6 bg-[#C6A15B]/5">
                <p className="italic text-[#E8E1D6] text-center font-light">“Complimentary standard shipping is available on all eligible prepaid orders within India.”</p>
              </div>
            </div>
          </div>

          <div id="order-tracking" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">4. Order Tracking</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Once an order is dispatched, the customer will receive tracking information securely through their registered email address, mobile number, or order account.</p>
            </div>
          </div>

          <div id="delivery-attempts" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">5. Delivery Attempts</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Customers must provide a complete and accurate delivery address, including the correct PIN code and contact number.</p>
              <p>Courier partners may contact the customer to complete delivery. If delivery fails because of an incorrect address, unavailable recipient, or repeated unsuccessful delivery attempts, the order may be returned to TARINI.</p>
              <p>Any additional reshipping charge must be communicated to the customer before the parcel is shipped again.</p>
            </div>
          </div>

          <div id="secure-packaging" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">6. Secure Jewellery Packaging</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Every TARINI order is carefully inspected and packed in secure, protective, unbranded outer packaging before dispatch to ensure maximum safety during transit.</p>
              <div className="p-4 border-l-[2px] border-[#C6A15B] mt-6 bg-[#C6A15B]/5">
                <p className="text-[#E8E1D6] font-medium tracking-wide text-[13px]">Please do not accept a package that appears opened, damaged or tampered with at the time of delivery.</p>
              </div>
            </div>
          </div>

          <div id="damaged-packages" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">7. Damaged or Tampered Packages</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>If a package is damaged, opened, or tampered with at the time of delivery, the customer should refuse the delivery whenever possible.</p>
              <p>If the issue is discovered after accepting the parcel, the customer should contact TARINI within 24 hours and provide:</p>
              <ul className="list-disc pl-5 space-y-2 text-[#E8E1D6]/80">
                <li>Order number</li>
                <li>Photographs of the outer packaging</li>
                <li>Photographs of the received product</li>
                <li>A clear unboxing video showing the sealed parcel being opened</li>
              </ul>
            </div>
          </div>

          <div id="incorrect-address" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">8. Incorrect Address</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Customers must carefully verify their shipping address before placing an order. Address changes can only be requested before dispatch and are subject to confirmation. Once shipped, we cannot change the destination address.</p>
            </div>
          </div>

          <div id="delayed-shipments" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">9. Delayed or Lost Shipments</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>If tracking information has not changed for an unusual period, please contact us for assistance. We will coordinate with the courier partner and provide an update. Any replacement or refund for a confirmed lost shipment will be processed only after the courier investigation is completed.</p>
            </div>
          </div>

          <div id="international-shipping" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">10. International Shipping</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>International shipping is currently unavailable. We are working toward bringing TARINI to more destinations globally in the near future.</p>
            </div>
          </div>

          <div id="order-cancellation" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">11. Order Cancellation</h2>
            <div className="text-[#E8E1D6]/90 text-[14px] leading-[1.8] font-light space-y-4">
              <p>Orders can only be cancelled before they are dispatched. Once an order has been shipped, cancellation will not be possible and our standard Return & Exchange policy will apply.</p>
              <p className="mt-4">
                <Link to="/return-policy" className="text-[#C6A15B] hover:text-[#E4C989] underline underline-offset-4 transition-colors font-medium">
                  Read our Return & Exchange Policy
                </Link>
              </p>
            </div>
          </div>

          <div id="contact-us" className="scroll-mt-32">
            <h2 className="text-[#C6A15B] text-[12px] uppercase tracking-[0.2em] font-medium mb-5">12. Contact Us</h2>
            <div className="bg-[#C6A15B]/5 p-8 border border-[#C6A15B]/20">
              <p className="text-[#E8E1D6] font-medium mb-8 font-sans text-[15px] leading-[1.6]">
                Need help with your delivery? Please contact our customer care team and include your order number so we can assist you quickly.
              </p>
              <div className="space-y-4 text-[14px] text-[#8A8177]">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="font-medium text-[#E8E1D6] min-w-[120px]">Email:</span>
                  <a href={`mailto:${CONTACT_DETAILS?.email || ''}`} className="hover:text-[#E4C989] transition-colors">{CONTACT_DETAILS?.email || 'Support'}</a>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="font-medium text-[#E8E1D6] min-w-[120px]">Phone/WhatsApp:</span>
                  <a href={`tel:${CONTACT_DETAILS?.phone?.replace(/\s+/g, '') || ''}`} className="hover:text-[#E4C989] transition-colors">{CONTACT_DETAILS?.phone || 'Support'}</a>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="font-medium text-[#E8E1D6] min-w-[120px]">Support Hours:</span>
                  <span>{CONTACT_DETAILS?.hours || 'Standard Business Hours'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-32">
        <div className="max-w-[700px] mx-auto text-center border-t border-[#C6A15B]/20 pt-16">
          <h2 className="text-[#C6A15B] text-[18px] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Still have questions?
          </h2>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.15em] text-[#E8E1D6] hover:text-[#E4C989] transition-colors group"
          >
            Contact Customer Care <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  );
}
