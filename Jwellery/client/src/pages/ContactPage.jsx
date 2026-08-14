import { Helmet } from 'react-helmet-async';

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us — Tarini Jewellers</title>
      </Helmet>
      <div className="container-luxury py-20 max-w-2xl">
        <h1 className="text-[32px] text-[#3A0508] mb-4 font-normal tracking-wide text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Get in Touch</h1>
        <p className="text-[#756B62] text-[15px] font-light text-center mb-8">
          We love hearing from you. Reach us at{' '}
          <a href="mailto:support@tarinijewellers.com" className="text-[#B59A68] hover:text-[#3A0508] underline transition-colors">
            support@tarinijewellers.com
          </a>{' '}
          or call <strong className="font-medium text-[#3A0508]">+91 98765 43210</strong>.
        </p>
        <form className="space-y-4">
          <input className="input-gold rounded-[2px] text-[13px] bg-transparent" placeholder="Your Name" />
          <input className="input-gold rounded-[2px] text-[13px] bg-transparent" type="email" placeholder="Your Email" />
          <input className="input-gold rounded-[2px] text-[13px] bg-transparent" placeholder="Subject" />
          <textarea className="input-gold rounded-[2px] text-[13px] h-32 resize-none bg-transparent" placeholder="Message" />
          <button className="w-full bg-[#3A0508] hover:bg-[#220306] text-[#F7F3EA] text-[11px] font-medium uppercase tracking-[0.12em] py-3.5 transition-all duration-[250ms] border-b-2 border-transparent hover:border-[#B59A68] rounded-[2px]">
            Send Message
          </button>
        </form>
      </div>
    </>
  );
}

