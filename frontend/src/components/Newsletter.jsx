import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Newsletter({
  title = 'Join the Lumière Circle',
  description = 'Get 10% off your first order, plus exclusive access to new scents, rituals, and candle care tips.',
}) {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast('Thank you for subscribing! 🕯️');
    setEmail('');
  };

  return (
    <div className="newsletter">
      <h2>{title}</h2>
      <p>{description}</p>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}
