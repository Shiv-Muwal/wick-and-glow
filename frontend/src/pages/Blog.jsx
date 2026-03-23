import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getBlogs } from '../api/client';

export default function Blog() {
  useScrollReveal();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getBlogs();
        if (!cancelled) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) {
          setPosts([]);
          setLoadError(e?.message || 'Could not load posts');
        }
      } finally {
        if (!cancelled) setLoading(false);
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

      <div className="min-h-[200px] px-[60px] pb-[100px] max-[1100px]:px-[30px] max-[1100px]:pb-[80px]">
        {loading ? (
          <p className="text-center text-[0.95rem] text-[var(--light-text)]">Loading journal…</p>
        ) : loadError ? (
          <p className="mx-auto max-w-[480px] text-center text-[0.95rem] text-[var(--light-text)]">
            {loadError}. Make sure the API is running (e.g. <code className="text-[0.85rem]">localhost:3000</code>).
          </p>
        ) : posts.length === 0 ? (
          <p className="mx-auto max-w-[480px] text-center text-[0.95rem] text-[var(--light-text)]">
            No published posts yet. Publish posts from the admin panel to show them here.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-[30px] max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
            {posts.map((post) => (
              <article
                key={post.id || post.title}
                className="reveal cursor-pointer overflow-hidden rounded-[20px] bg-white shadow-[var(--shadow)] transition hover:-translate-y-[8px] hover:shadow-[var(--shadow-hover)]"
              >
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
                    <img
                      src={post.coverImageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    post.emoji || '🕯️'
                  )}
                </div>
                <div className="px-[24px] pb-[28px] pt-[28px]">
                  <span className="mb-[14px] inline-block rounded-[20px] bg-[rgba(132,165,157,0.15)] px-[12px] py-[4px] text-[0.72rem] font-semibold uppercase tracking-[1px] text-[var(--sage)]">
                    {post.tag || 'Journal'}
                  </span>
                  <h3 className="mb-[12px] font-['Playfair_Display',serif] text-[1.2rem] leading-[1.4] text-[var(--deep)]">
                    {post.title}
                  </h3>
                  <p className="mb-[20px] text-[0.87rem] leading-[1.7] text-[var(--light-text)]">
                    {post.excerpt || ''}
                  </p>
                  <div className="flex items-center justify-between text-[0.78rem] text-[var(--light-text)]">
                    <span>{post.date}</span>
                    <span className="text-[0.82rem] font-semibold text-[var(--sage)]">Read More →</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Newsletter />
    </>
  );
}
