import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { postNewsletter } from '../api/client';

export default function Newsletter({
  title = 'Join the Lumière Circle',
  description = 'Get 10% off your first order, plus exclusive access to new scents, rituals, and candle care tips.',
}) {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await postNewsletter(email.trim());
      showToast('Thank you for subscribing! 🕯️');
      setEmail('');
    } catch {
      showToast('Thank you for subscribing! 🕯️');
      setEmail('');
    }
  };

  return (
    <div className="bg-[linear-gradient(135deg,var(--sage)_0%,#6b8f87_100%)] 
py-[80px] px-[60px] 
text-center">
      <h2 className="font-['Playfair_Display',serif] text-[2.5rem] text-white mb-[16px]">{title}</h2>
      <p className="text-[rgba(255,255,255,0.8)] mb-[36px] text-[1rem]">{description}</p>
      <form className="flex max-w-[480px] mx-auto 
bg-white rounded-[50px] 
overflow-hidden 
shadow-[0_20px_60px_rgba(0,0,0,0.2)] " onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-[24px] py-[18px] 
border-none outline-none 
font-['Poppins',sans-serif] text-[0.9rem] 
bg-transparent"
        />
        <button type="submit"  className="bg-[var(--deep)] text-[var(--cream)] 
border-none px-[32px] py-[18px] 
text-[0.82rem] font-semibold tracking-[1px] uppercase 
cursor-none transition 
hover:bg-[var(--gold)] hover:text-[var(--deep)]">Subscribe</button>
      </form>
    </div>
  );
}
