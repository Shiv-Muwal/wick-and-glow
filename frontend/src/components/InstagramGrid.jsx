const ITEMS = ['🌸', '🕯️', '🌿', '🌹', '✨', '🏺'];

export default function InstagramGrid() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="section-header" style={{ padding: '0 60px' }}>
        <div className="section-eyebrow reveal">@wickandglow</div>
        <h2 className="section-title reveal">Follow the Glow</h2>
        <div className="section-line" />
      </div>
      <div className="grid grid-cols-6 gap-[4px] max-[1100px]:grid-cols-3 max-[768px]:grid-cols-2" style={{ marginTop: 40 }}>
        {ITEMS.map((emoji) => (
          <div key={emoji} className="aspect-square overflow-hidden bg-[var(--blush)] relative cursor-none">
            <div className="insta-placeholder">{emoji}</div>
            <div className="insta-overlay">📷</div>
          </div>
        ))}
      </div>
    </section>
  );
}
