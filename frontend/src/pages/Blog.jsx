import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { useScrollReveal } from '../hooks/useScrollReveal';

const POSTS = [
  { tag: 'Wellness', title: 'Benefits of Soy Candles Over Paraffin', excerpt: 'Natural soy wax burns cleaner, lasts longer...', date: 'Nov 28, 2024', emoji: '🌿' },
  { tag: 'Aromatherapy', title: 'Best Candle Scents for Relaxation', excerpt: 'Lavender, chamomile, sandalwood, vanilla...', date: 'Nov 15, 2024', emoji: '💜' },
  { tag: 'Home Decor', title: 'Home Decor with Candles: 8 Styling Ideas', excerpt: 'Candles are the most versatile décor element...', date: 'Nov 3, 2024', emoji: '🏠' },
];

export default function Blog() {
  useScrollReveal();

  return (
    <>
      <div className="shop-hero">
        <h1>The Lumière Journal</h1>
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>Journal</span></div>
        <p style={{ marginTop: 16, color: 'var(--light-text)', fontSize: '0.95rem', maxWidth: 480, marginInline: 'auto' }}>
          Stories, rituals, and wisdom from the world of candles.
        </p>
      </div>

      <div className="blog-grid">
        {POSTS.map((post) => (
          <article key={post.title} className="blog-card reveal">
            <div className="blog-img" style={{ background: `linear-gradient(135deg,var(--blush),#e8b4a0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
              {post.emoji}
            </div>
            <div className="blog-content">
              <span className="blog-tag">{post.tag}</span>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-meta">
                <span>{post.date}</span>
                <a href="#" className="read-more">Read More →</a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Newsletter />
    </>
  );
}
