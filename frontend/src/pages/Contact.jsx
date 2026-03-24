import { useState } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { useToast } from '../context/ToastContext';
import { postContact } from '../api/client';

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postContact({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      showToast("Message sent! We'll get back to you soon ✨");
      setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      showToast('Could not send message. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <div className="pt-[160px] px-[60px] pb-[80px] 
text-center 
bg-[linear-gradient(135deg,var(--cream)_0%,var(--blush)_100%)]">
        <h1 className=" font-['Playfair_Display',serif] text-[3rem] text-[var(--deep)]">Get in Touch</h1>
        <div className="flex items-center justify-center gap-[10px] mt-[12px] text-[0.82rem] text-[var(--light-text)]"><Link to="/" className="text-[var(--sage)] no-underline">Home</Link> / <span>Contact</span></div>
        <p className="mt-4 text-[0.95rem] text-lightText">
          We&apos;d love to hear from you. Whether it&apos;s a question, a custom order, or just to say hello.
        </p>
      </div>

      <section className="px-0 pb-[100px] pt-[60px]">
        <div className="grid 
grid-cols-[1fr_1.5fr] 
gap-[60px] 
p-[60px] 
max-[1100px]:grid-cols-1 max-[1100px]:p-[30px]">
          <div>
            <h2 className="font-['Playfair_Display',serif] text-[2rem] text-[var(--deep)]">
              Let&apos;s Start a Conversation
            </h2>
            <p className="mt-[12px] text-[0.95rem] leading-[1.8] text-[var(--light-text)]">
              Whether you have a question about our candles, need help with an order, or want to
              explore custom gifting options — our team is here to help.
            </p>
            <div className="mt-[28px] grid gap-[14px]">
              <div className="flex items-start gap-[14px] rounded-[14px] border border-[var(--border)] bg-white p-[14px]">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--blush)] text-[1.05rem]">📍</div>
                <div>
                  <h4 className="text-[0.95rem] font-semibold text-[var(--deep)]">Visit Our Studio</h4>
                  <p className="text-[0.85rem] leading-[1.6] text-[var(--light-text)]">12 Artisan Lane, Bandra West<br />Mumbai, Maharashtra 400050</p>
                </div>
              </div>
              <div className="flex items-start gap-[14px] rounded-[14px] border border-[var(--border)] bg-white p-[14px]">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--blush)] text-[1.05rem]">📧</div>
                <div>
                  <h4 className="text-[0.95rem] font-semibold text-[var(--deep)]">Email Us</h4>
                  <p className="text-[0.85rem] leading-[1.6] text-[var(--light-text)]">hello@wickandglow.com<br />orders@wickandglow.com</p>
                </div>
              </div>
              <div className="flex items-start gap-[14px] rounded-[14px] border border-[var(--border)] bg-white p-[14px]">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--blush)] text-[1.05rem]">📞</div>
                <div>
                  <h4 className="text-[0.95rem] font-semibold text-[var(--deep)]">Call or WhatsApp</h4>
                  <p className="text-[0.85rem] leading-[1.6] text-[var(--light-text)]">+91 98765 43210<br />Mon–Sat: 10am – 7pm IST</p>
                </div>
              </div>
              <div className="flex items-start gap-[14px] rounded-[14px] border border-[var(--border)] bg-white p-[14px]">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--blush)] text-[1.05rem]">📸</div>
                <div>
                  <h4 className="text-[0.95rem] font-semibold text-[var(--deep)]">Follow Us</h4>
                  <p className="text-[0.85rem] leading-[1.6] text-[var(--light-text)]">@wickandglow on Instagram<br />Join our community</p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-[20px] bg-blush p-8">
              <h4 className="mb-5 font-['Playfair_Display',serif] text-[1.1rem] text-deep">
                Common Questions
              </h4>
              <div className="flex flex-col gap-[14px]">
                <details className="cursor-pointer">
                  <summary className="list-none text-[0.9rem] font-semibold text-text">
                    Do you offer bulk / corporate orders?
                  </summary>
                  <p className="mt-2 text-[0.85rem] leading-[1.6] text-lightText">
                    Yes! We love creating custom candle sets for corporate gifting, weddings, and events. Email us at orders@wickandglow.com for pricing.
                  </p>
                </details>
                <details className="cursor-pointer">
                  <summary className="list-none text-[0.9rem] font-semibold text-text">
                    How long does shipping take?
                  </summary>
                  <p className="mt-2 text-[0.85rem] leading-[1.6] text-lightText">
                    Standard shipping is 3–5 business days. Express delivery (1–2 days) is available for major cities. All orders include tracking.
                  </p>
                </details>
                <details className="cursor-pointer">
                  <summary className="list-none text-[0.9rem] font-semibold text-text">
                    Can I request a custom scent?
                  </summary>
                  <p className="mt-2 text-[0.85rem] leading-[1.6] text-lightText">
                    Absolutely! We offer custom fragrance blending for orders of 20+ units. Reach out with your inspiration and we&apos;ll create something unique for you.
                  </p>
                </details>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[var(--border)] bg-white p-[28px] shadow-[var(--shadow)]">
            <h3 className="mb-[16px] font-['Playfair_Display',serif] text-[1.35rem] text-[var(--deep)]">Send Us a Message</h3>
            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-[14px] max-[700px]:grid-cols-1">
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[0.78rem] font-semibold text-[var(--deep)]">First Name</label>
                  <input className="rounded-[10px] border border-[#d7d7d7] px-[12px] py-[10px] text-[0.9rem] outline-none focus:border-[var(--sage)]" type="text" name="firstName" placeholder="Kavya" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[0.78rem] font-semibold text-[var(--deep)]">Last Name</label>
                  <input className="rounded-[10px] border border-[#d7d7d7] px-[12px] py-[10px] text-[0.9rem] outline-none focus:border-[var(--sage)]" type="text" name="lastName" placeholder="Nair" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>
              <div className="mt-[12px] flex flex-col gap-[6px]">
                <label className="text-[0.78rem] font-semibold text-[var(--deep)]">Email Address</label>
                <input className="rounded-[10px] border border-[#d7d7d7] px-[12px] py-[10px] text-[0.9rem] outline-none focus:border-[var(--sage)]" type="email" name="email" placeholder="kavya@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mt-[12px] flex flex-col gap-[6px]">
                <label className="text-[0.78rem] font-semibold text-[var(--deep)]">Phone (Optional)</label>
                <input className="rounded-[10px] border border-[#d7d7d7] px-[12px] py-[10px] text-[0.9rem] outline-none focus:border-[var(--sage)]" type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              </div>
              <div className="mt-[12px] flex flex-col gap-[6px]">
                <label className="text-[0.78rem] font-semibold text-[var(--deep)]">Subject</label>
                <select className="rounded-[10px] border border-[#d7d7d7] px-[12px] py-[10px] text-[0.9rem] outline-none focus:border-[var(--sage)]" name="subject" value={form.subject} onChange={handleChange}>
                  <option value="">Select a subject</option>
                  <option>Order Enquiry</option>
                  <option>Custom / Bulk Order</option>
                  <option>Product Question</option>
                  <option>Collaboration</option>
                  <option>General Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mt-[12px] flex flex-col gap-[6px]">
                <label className="text-[0.78rem] font-semibold text-[var(--deep)]">Message</label>
                <textarea className="min-h-[130px] rounded-[10px] border border-[#d7d7d7] px-[12px] py-[10px] text-[0.9rem] outline-none focus:border-[var(--sage)]" name="message" placeholder="Tell us how we can help you..." value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="mt-[16px] w-full rounded-[999px] bg-[var(--deep)] px-[16px] py-[15px] text-[0.8rem] font-semibold uppercase tracking-[1.3px] text-[var(--cream)] transition hover:bg-[var(--gold)] hover:text-[var(--deep)]">Send Message →</button>
            </form>
          </div>
        </div>

        <div className="px-[60px]">
          <div className="rounded-[24px] shadow-[var(--shadow)]">
            <div className="mt-5 rounded-[24px] bg-white p-[42px] text-center">
            <div className="mb-[10px] text-[2rem]">📍</div>
            <p className="mb-[6px] font-semibold text-deep">
              Wick &amp; Glow Studio — Bandra West, Mumbai
            </p>
            <p className="mb-[14px] text-[0.85rem] text-lightText">
              12 Artisan Lane, Mumbai 400050 · Open Mon–Sat 10am–7pm
            </p>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex rounded-[999px] border-[1.5px] border-[rgba(132,165,157,0.35)] px-[26px] py-[12px] text-[0.78rem] font-semibold uppercase tracking-[1.3px] text-[var(--text)] no-underline transition hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white">
              Open in Google Maps →
            </a>
            </div>
          </div>
        </div>
      </section>

      <Newsletter
        title="Stay Connected"
        description="Get candle care tips, new arrivals, and exclusive offers delivered to your inbox."
      />
    </>
  );
}
