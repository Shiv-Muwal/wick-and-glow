import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="hero-content reveal">
        <div className="hero-eyebrow">Since 2019 · Handcrafted with Love</div>
        <h1>Handcrafted <em>Luxury</em><br />Candles</h1>
        <p>
          Each flame tells a story. Our small-batch soy candles are lovingly made with premium
          fragrances, natural wax, and designs that transform any space into a sanctuary.
        </p>
        <div className="hero-btns">
          <Link to="/shop" className="btn-primary">Shop Now →</Link>
          <Link to="/about" className="btn-secondary">Our Story</Link>
        </div>
        <div className="hero-stats">
          <div className="stat-item"><span className="stat-num">12K+</span><span className="stat-label">Happy Customers</span></div>
          <div className="stat-item"><span className="stat-num">40+</span><span className="stat-label">Scents</span></div>
          <div className="stat-item"><span className="stat-num">100%</span><span className="stat-label">Natural Soy</span></div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="float-el">
          <div className="mini-candle" style={{ background: 'linear-gradient(180deg,#f5cac3,#e8a090)' }} />
        </div>
        <div className="float-el">
          <div className="mini-candle" style={{ background: 'linear-gradient(180deg,#84a59d,#6a8f87)' }} />
        </div>

        <div className="candle-scene">
          <div className="candle-3d">
            <div className="glow-orb" />
            <div className="candle-flame-wrap">
              <div className="candle-flame">
                <div className="candle-flame-inner" />
              </div>
            </div>
            <div className="candle-wick" />
            <div className="candle-3d-body">
              <div className="candle-drip" />
              <div className="candle-drip" />
              <div
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 70,
                  height: 50,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 9, fontWeight: 700, color: '#3d2314', letterSpacing: 1 }}>LUMIÈRE</span>
                <span style={{ fontSize: 7, color: '#7a5c4e', letterSpacing: 0.5 }}>SOY WAX</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
