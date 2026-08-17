import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaPinterestP } from 'react-icons/fa';

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-[11px] text-[#756B62] uppercase tracking-widest hover:text-[#5C1D24] transition-colors"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 bg-[#FDFBF7] text-[#5C1D24] border-t border-[#EAE6DF]">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Top Section */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-block mb-4">
            <span
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-3xl tracking-[0.1em] font-normal text-[#5C1D24] block"
            >
              TARINI
            </span>
            <span className="text-[9px] text-[#C7A56A] tracking-[0.3em] uppercase block">
              JEWELLERS
            </span>
          </Link>
          <div className="flex justify-center gap-6 mt-6">
            <a href="#" className="text-[#5C1D24] hover:text-[#C7A56A] transition-colors"><FiInstagram size={18} /></a>
            <a href="#" className="text-[#5C1D24] hover:text-[#C7A56A] transition-colors"><FiFacebook size={18} /></a>
            <a href="#" className="text-[#5C1D24] hover:text-[#C7A56A] transition-colors"><FaPinterestP size={18} /></a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left mb-16">
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#5C1D24] mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/category/rings">Rings</FooterLink></li>
              <li><FooterLink to="/category/necklaces">Necklaces</FooterLink></li>
              <li><FooterLink to="/category/earrings">Earrings</FooterLink></li>
              <li><FooterLink to="/category/bracelets">Bracelets</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#5C1D24] mb-6">About</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/about">Our Story</FooterLink></li>
              <li><FooterLink to="/about">Our Materials</FooterLink></li>
              <li><FooterLink to="/about">Journal</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#5C1D24] mb-6">Help</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/contact">Contact Us</FooterLink></li>
              <li><FooterLink to="/shipping">Shipping</FooterLink></li>
              <li><FooterLink to="/returns">Returns</FooterLink></li>
              <li><FooterLink to="/faqs">FAQs</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[#5C1D24] mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center border-t border-[#EAE6DF] pt-8">
          <p className="text-[10px] tracking-widest uppercase text-[#756B62]">
            © {new Date().getFullYear()} TARINI JEWELLERS. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
}
