import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[var(--deep)] text-[rgba(247,237,226,0.8)] pt-[80px] px-[60px] pb-[40px]">
      <div
        className="grid 
grid-cols-[2fr_1fr_1fr_1.5fr] 
gap-[60px] 
mb-[60px] 
max-[1100px]:grid-cols-2 max-[1100px]:gap-[40px] 
max-[768px]:grid-cols-1"
      >
        <div className="">
          
          <Link to="/" className="nav-logo text-[var(--cream)] mb-[20px] flex">
            <div className="logo-flame" />
            Wick &amp; Glow
          </Link>
          <p className="mt-4 text-[0.88rem] leading-[1.8] text-[rgba(247,237,226,0.6)] max-w-[260px]">
            Handcrafted candles made with natural soy wax and premium
            fragrances. Each candle brings warmth, relaxation, and beauty to
            your home.
          </p>

          <div className="flex gap-3 mt-6">
            <a
              href="#"
              className="w-[40px] h-[40px] rounded-full 
bg-[rgba(247,237,226,0.1)] 
border border-[rgba(246,189,96,0.2)] 
flex items-center justify-center 
text-[var(--cream)] text-[1rem] no-underline 
transition 
hover:bg-[var(--gold)] hover:text-[var(--deep)]"
            >
              📘
            </a>
            <a
              href="#"
              className="w-[40px] h-[40px] rounded-full 
bg-[rgba(247,237,226,0.1)] 
border border-[rgba(246,189,96,0.2)] 
flex items-center justify-center 
text-[var(--cream)] text-[1rem] no-underline 
transition 
hover:bg-[var(--gold)] hover:text-[var(--deep)]"
            >
              📸
            </a>
            <a
              href="#"
              className="w-[40px] h-[40px] rounded-full 
bg-[rgba(247,237,226,0.1)] 
border border-[rgba(246,189,96,0.2)] 
flex items-center justify-center 
text-[var(--cream)] text-[1rem] no-underline 
transition 
hover:bg-[var(--gold)] hover:text-[var(--deep)]"
            >
              🐦
            </a>
            <a
              href="#"
              className="w-[40px] h-[40px] rounded-full 
bg-[rgba(247,237,226,0.1)] 
border border-[rgba(246,189,96,0.2)] 
flex items-center justify-center 
text-[var(--cream)] text-[1rem] no-underline 
transition 
hover:bg-[var(--gold)] hover:text-[var(--deep)]"
            >
              📌
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-['Playfair_Display',serif] text-[1.05rem] text-[var(--cream)] mb-[24px]">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/shop"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/about"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/blog"
              >
                Journal
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/contact"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/dashboard"
              >
                My account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-['Playfair_Display',serif] text-[1.05rem] text-[var(--cream)] mb-[24px]">
            Customer Care
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/legal/faq"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/legal/shipping"
              >
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/legal/returns"
              >
                Returns
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/track-order"
              >
                Track order (guest)
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/dashboard"
              >
                My orders (signed in)
              </Link>
            </li>
            <li>
              <Link
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                to="/legal/candle-care"
              >
                Candle Care
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-['Playfair_Display',serif] text-[1.05rem] text-[var(--cream)] mb-[24px]">
            Contact Us
          </h4>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                href="mailto:hello@wickandglow.com"
              >
                hello@wickandglow.com
              </a>
            </li>
            <li>
              <a
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                href="tel:+919876543210"
              >
                +91 98765 43210
              </a>
            </li>
            <li>
              <a
                className="text-[rgba(247,237,226,0.6)] no-underline text-[0.88rem] transition-colors duration-300 hover:text-[var(--gold)]"
                href="#"
              >
                12 Artisan Lane, Mumbai 400001
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="border-t border-[rgba(247,237,226,0.1)] 
pt-[30px] 
flex items-center justify-between 
text-[0.82rem] text-[rgba(247,237,226,0.4)]"
      >
        <span>
          © {new Date().getFullYear()} Wick &amp; Glow. All rights reserved.
          <span className="mx-2 opacity-50">·</span>
          <Link to="/legal/privacy" className="text-[rgba(247,237,226,0.55)] hover:text-[var(--gold)] no-underline">
            Privacy
          </Link>
          <span className="mx-2 opacity-50">·</span>
          <Link to="/legal/terms" className="text-[rgba(247,237,226,0.55)] hover:text-[var(--gold)] no-underline">
            Terms
          </Link>
        </span>
        <div className="flex gap-[10px] text-[1.5rem]">💳 🔒 ✅</div>
      </div>
    </footer>
  );
}
