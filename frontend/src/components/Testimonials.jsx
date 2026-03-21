export default function Testimonials() {
  const items = [
    { stars: 5, text: '"The Lavender Calm candle transformed my evenings. I light it during my reading time and the scent is absolutely divine — not overpowering at all."', name: 'Priya Sharma', loc: 'Mumbai, India', avatar: 'P' },
    { stars: 5, text: '"Gifted the White Oudh candle to my mother on her birthday and she was absolutely thrilled. The packaging alone feels like opening a luxury gift box."', name: 'Arjun Mehta', loc: 'Delhi, India', avatar: 'A' },
    { stars: 5, text: '"I\'ve tried many candle brands but Wick & Glow is on another level. The Floral Clay Candle looks like artwork! So beautiful I almost don\'t want to burn it."', name: 'Sneha Iyer', loc: 'Bengaluru, India', avatar: 'S' },
  ];

  return (
    <section className="testimonials">
      <div className="section-header">
        <div className="section-eyebrow reveal" style={{ color: 'rgba(247,237,226,0.6)' }}>Customer Love</div>
        <h2 className="section-title reveal">Words from Our Community</h2>
        <div className="section-line" />
      </div>
      <div className="testimonials-grid">
        {items.map((item) => (
          <div key={item.name} className="testimonial-card reveal">
            <div className="stars">{'★'.repeat(item.stars)}</div>
            <p>{item.text}</p>
            <div className="testimonial-author">
              <div className="author-avatar">{item.avatar}</div>
              <div>
                <div className="author-name">{item.name}</div>
                <div className="author-loc">{item.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
