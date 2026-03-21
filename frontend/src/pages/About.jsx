import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function About() {
  useScrollReveal();

  return (
    <>
      <section className="about-hero">
        <div className="about-img reveal">
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#f5cac3 0%,#f7ede2 50%,#e8d4b4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
            <div style={{ fontSize: '6rem' }}>🕯️</div>
          </div>
          <div className="about-img-badge">
            <div className="num">2019</div>
            <div className="label">Founded with Love</div>
          </div>
        </div>
        <div className="about-content reveal">
          <div className="section-eyebrow">Our Story</div>
          <h1>Born from a <em style={{ fontStyle: 'italic', color: '#84a59d' }}>Flicker</em> of Passion</h1>
          <p>Wick &amp; Glow began in a small Mumbai kitchen in 2019, when founder Kavya Nair couldn&apos;t find candles that were both truly natural and genuinely beautiful. She started making her own — slowly, intentionally, with love.</p>
          <p>What started as a weekend hobby quickly grew into a movement. Word spread through social media, friends, and family. Each candle was different, each one carried a story. Today, Wick &amp; Glow serves customers across India.</p>
          <div style={{ display: 'flex', gap: 30, marginTop: 36, flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-primary">Shop Our Candles</Link>
            <Link to="/contact" className="btn-secondary">Get in Touch</Link>
          </div>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
