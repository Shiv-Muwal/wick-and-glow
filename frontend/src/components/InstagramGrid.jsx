const ITEMS = ['🌸', '🕯️', '🌿', '🌹', '✨', '🏺'];

export default function InstagramGrid() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="section-header" style={{ padding: '0 60px' }}>
        <div className="section-eyebrow reveal">@lumierecandles</div>
        <h2 className="section-title reveal">Follow the Glow</h2>
        <div className="section-line" />
      </div>
      <div className="instagram-grid" style={{ marginTop: 40 }}>
        {ITEMS.map((emoji) => (
          <div key={emoji} className="insta-item">
            <div className="insta-placeholder">{emoji}</div>
            <div className="insta-overlay">📷</div>
          </div>
        ))}
      </div>
    </section>
  );
}
