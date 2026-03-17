import { useState } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you soon ✨");
    setForm({ firstName: '', lastName: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <div className="shop-hero">
        <h1>Get in Touch</h1>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Contact</span></div>
        <p style={{ marginTop: 16, color: 'var(--light-text)', fontSize: '0.95rem' }}>
          We&apos;d love to hear from you.
        </p>
      </div>

      <section style={{ padding: '60px 0 100px' }}>
        <div className="contact-layout">
          <div className="reveal">
            <h2>Let&apos;s Start a Conversation</h2>
            <p>Whether you have a question about our candles, need help with an order, or want to explore custom gifting options — our team is here to help.</p>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Visit Our Studio</h4>
                  <p>12 Artisan Lane, Bandra West<br />Mumbai, Maharashtra 400050</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email Us</h4>
                  <p>hello@lumiere.in<br />orders@lumiere.in</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Call or WhatsApp</h4>
                  <p>+91 98765 43210<br />Mon–Sat: 10am – 7pm IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form reveal">
            <h3>Send Us a Message</h3>
            <form id="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" placeholder="Kavya" value={form.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" placeholder="Nair" value={form.lastName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="kavya@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone (Optional)</label>
                <input type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}>
                  <option value="">Select a subject</option>
                  <option>Order Enquiry</option>
                  <option>Custom / Bulk Order</option>
                  <option>Product Question</option>
                  <option>General Feedback</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" placeholder="Tell us how we can help you..." value={form.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: 18 }}>Send Message →</button>
            </form>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
