import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { postNewsletter } from '../api/client';

export default function Newsletter({
  title = 'Join the Wick & Glow list',
  description = 'Get 10% off your first order, plus exclusive access to new scents, rituals, and candle care tips.',
}) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      const data = await postNewsletter(email.trim());
      if (data?.alreadySubscribed) {
        showToast("You are already on the list — thank you!");
      } else if (data?.emailSent === false) {
        showToast(
          "You are subscribed! We could not send the welcome email yet — check that EMAIL_* is set on the server."
        );
      } else {
        showToast('Check your inbox for a welcome email from Wick & Glow.');
      }
      setEmail('');
    } catch (err) {
      showToast(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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
        <button
          type="submit"
          disabled={submitting}
          className="bg-[var(--deep)] text-[var(--cream)] 
border-none px-[32px] py-[18px] 
text-[0.82rem] font-semibold tracking-[1px] uppercase 
transition disabled:cursor-not-allowed disabled:opacity-60
hover:bg-[var(--gold)] hover:text-[var(--deep)]"
        >
          {submitting ? 'Sending…' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
