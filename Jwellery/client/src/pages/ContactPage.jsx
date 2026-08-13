import { Helmet } from 'react-helmet-async';
export default function ContactPage() {
  return (
    <>
      <Helmet><title>Contact Us — Jwellery</title></Helmet>
      <div className="container-luxury py-16 max-w-2xl">
        <h1 className="font-serif text-4xl text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-gray-500 mb-8">We love hearing from you. Reach us at <a href="mailto:support@jwellery.com" className="text-[#c9a84c]">support@jwellery.com</a> or call <strong>+91 98765 43210</strong>.</p>
        <form className="space-y-4">
          <input className="input-gold" placeholder="Your Name" />
          <input className="input-gold" type="email" placeholder="Your Email" />
          <input className="input-gold" placeholder="Subject" />
          <textarea className="input-gold h-32 resize-none" placeholder="Message" />
          <button className="btn-gold rounded-xl py-3 w-full">Send Message</button>
        </form>
      </div>
    </>
  );
}
