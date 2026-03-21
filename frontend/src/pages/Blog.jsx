import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getBlogs } from '../api/client';

const FALLBACK = [
  { tag: 'Wellness', title: 'Benefits of Soy Candles Over Paraffin', excerpt: 'Natural soy wax burns cleaner, lasts longer...', date: 'Nov 28, 2024', emoji: '🌿' },
  { tag: 'Aromatherapy', title: 'Best Candle Scents for Relaxation', excerpt: 'Lavender, chamomile, sandalwood, vanilla...', date: 'Nov 15, 2024', emoji: '💜' },
  { tag: 'Home Decor', title: 'Home Decor with Candles: 8 Styling Ideas', excerpt: 'Candles are the most versatile décor element...', date: 'Nov 3, 2024', emoji: '🏠' },
];

export default function Blog() {
  useScrollReveal();
  const [posts, setPosts] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getBlogs();
        if (!cancelled && Array.isArray(data) && data.length > 0) setPosts(data);
      } catch {
        /* FALLBACK */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="pt-[160px] px-[60px] pb-[80px] 
text-center 
bg-[linear-gradient(135deg,var(--cream)_0%,var(--blush)_100%)]">
        <h1 className=" font-['Playfair_Display',serif] text-[3rem] text-[var(--deep)]">The Wick &amp; Glow Journal</h1>
        <div className="flex items-center justify-center gap-[10px] mt-[12px] text-[0.82rem] text-[var(--light-text)]"><Link to="/" className="text-[var(--sage)] no-underline">Home</Link> / <span>Journal</span></div>
        <p style={{ marginTop: 16, color: 'var(--light-text)', fontSize: '0.95rem', maxWidth: 480, marginInline: 'auto' }}>
          Stories, rituals, and wisdom from the world of candles.
        </p>
      </div>

      <div className="grid 
grid-cols-3 
gap-[30px] 
px-[60px] pb-[100px] 
max-[1100px]:grid-cols-2 max-[1100px]:px-[30px] max-[1100px]:pb-[80px] 
max-[768px]:grid-cols-1">
        {posts.map((post) => (
          <article key={post.id || post.title} className="bg-white rounded-[20px] overflow-hidden 
shadow-[var(--shadow)] 
transition 
cursor-pointer 
hover:-translate-y-[8px] hover:shadow-[var(--shadow-hover)] reveal">
            <div
              className="h-[220px] overflow-hidden bg-[var(--blush)]"
              style={
                post.coverImageUrl
                  ? {}
                  : {
                      background: `linear-gradient(135deg,var(--blush),#e8b4a0)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '5rem',
                    }
              }
            >
              {post.coverImageUrl ? (
                <img src={post.coverImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                post.emoji
              )}
            </div>
            <div className="pt-[28px]">
              <span className="inline-block 
bg-[rgba(132,165,157,0.15)] 
text-[var(--sage)] 
px-[12px] py-[4px] 
rounded-[20px] 
text-[0.72rem] font-semibold tracking-[1px] uppercase 
mb-[14px]">{post.tag}</span>
              <h3 className="font-['Playfair_Display',serif] 
text-[1.2rem] 
text-[var(--deep)] 
mb-[12px] 
leading-[1.4]">{post.title}</h3>
              <p className="text-[0.87rem] text-[var(--light-text)] leading-[1.7] mb-[20px]">{post.excerpt}</p>
              <div className="flex items-center justify-between 
text-[0.78rem] text-[var(--light-text)]">
                <span>{post.date}</span>
                <span className="text-[var(--sage)] font-semibold text-[0.82rem]">Read More →</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Newsletter />
    </>
  );
}
