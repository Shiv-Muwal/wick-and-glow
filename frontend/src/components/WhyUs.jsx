export default function WhyUs() {
  const items = [
    {
      icon: '🤲',
      title: 'Truly Handmade',
      text: 'Every single candle is hand-poured in small batches by our artisans, ensuring each piece carries genuine love and attention to detail.',
    },
    {
      icon: '🌿',
      title: 'Premium Soy Wax',
      text: 'We use only 100% natural soy wax — cleaner burning, longer lasting, and completely biodegradable. No paraffin, ever.',
    },
    {
      icon: '⏳',
      title: 'Long Burn Time',
      text: 'Our candles burn for 35–55+ hours, giving you more time with the scents and ambiance you love.',
    },
    {
      icon: '♻️',
      title: 'Eco Friendly',
      text: 'Sustainable packaging, reusable containers, and cruelty-free ingredients. Beauty that does not cost the earth.',
    },
  ];

  return (
    <section className="bg-[linear-gradient(135deg,var(--blush)_0%,var(--cream)_100%)] px-[60px] py-[100px] max-[1100px]:px-[30px] max-[1100px]:py-[80px]">
      <div className="mb-[52px] text-center">
        <div className="mb-[12px] text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[var(--sage)]">
          Why Wick &amp; Glow
        </div>
        <h2 className="font-['Playfair_Display',serif] text-[clamp(2rem,3.5vw,3rem)] leading-[1.2] text-[var(--deep)]">
          Made with Intention
        </h2>
        <div className="mx-auto mt-[20px] h-[2px] w-[60px] rounded-[2px] bg-[linear-gradient(90deg,var(--sage),var(--gold))]" />
      </div>

      <div className="grid grid-cols-4 gap-[30px] max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        {items.map((item) => (
          <div
            key={item.title}
            className="group relative overflow-hidden rounded-[24px] border border-[rgba(246,189,96,0.2)] bg-[var(--glass)] p-[30px] text-center backdrop-blur-[20px] transition-all hover:-translate-y-[8px] hover:shadow-[var(--shadow)]"
          >
            <div className="mb-[18px] text-[2.3rem]">{item.icon}</div>
            <h3 className="mb-[12px] font-['Playfair_Display',serif] text-[1.15rem] text-[var(--deep)]">
              {item.title}
            </h3>
            <p className="text-[0.88rem] leading-[1.7] text-[var(--light-text)]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
