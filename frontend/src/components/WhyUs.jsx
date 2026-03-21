export default function WhyUs() {
  const items = [
    { icon: '🤲', title: 'Truly Handmade', text: 'Every single candle is hand-poured in small batches by our artisans, ensuring each piece carries genuine love and attention to detail.' },
    { icon: '🌿', title: 'Premium Soy Wax', text: 'We use only 100% natural soy wax — cleaner burning, longer lasting, and completely biodegradable. No paraffin, ever.' },
    { icon: '⏳', title: 'Long Burn Time', text: 'Our candles burn for 35–55+ hours, giving you more time with the scents and ambiance you love.' },
    { icon: '♻️', title: 'Eco Friendly', text: "Sustainable packaging, reusable containers, and cruelty-free ingredients. Beauty that doesn't cost the earth." },
  ];

  return (
    <section className="why-us">
      <div className="section-header">
        <div className="section-eyebrow reveal">Why Wick &amp; Glow</div>
        <h2 className="section-title reveal">Made with Intention</h2>
        <div className="section-line" />
      </div>
      <div className="why-grid">
        {items.map((item) => (
          <div key={item.title} className="why-card reveal">
            <span className="why-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
