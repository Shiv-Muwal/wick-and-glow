import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import { getBlogs } from '../api/client';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const CHUNK_SIZE = 3;
  const MAX_SHOW_MORE = 8;
  const PAGE_SIZE = 8;

  // Show more only page 1 pe; pagination baad mein.
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getBlogs();
        if (!cancelled) {
          const next = Array.isArray(data) ? data : [];
          setPosts(next);
          setPage(1);
          setVisibleCount(
            Math.min(CHUNK_SIZE, MAX_SHOW_MORE, next.length)
          );
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

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  const visiblePosts =
    page === 1
      ? posts.slice(0, Math.min(visibleCount, MAX_SHOW_MORE, posts.length))
      : posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const desktopColsClass =
    visiblePosts.length >= 6 ? 'grid-cols-4' : 'grid-cols-3';

  const canShowMore =
    page === 1 && visibleCount < MAX_SHOW_MORE && visibleCount < posts.length;

  const canPaginate = posts.length > MAX_SHOW_MORE;
  const showPagination = canPaginate && (page !== 1 || visibleCount >= MAX_SHOW_MORE);

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
          <>
            <div
              className={`grid gap-[30px] ${desktopColsClass} max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1`}
            >
              {visiblePosts.map((post) => (
                <article
                  key={post.id || post.title}
                  className="cursor-pointer overflow-hidden rounded-[20px] bg-white shadow-[var(--shadow)] transition hover:-translate-y-[8px] hover:shadow-[var(--shadow-hover)]"
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
                      <span className="text-[0.82rem] font-semibold text-[var(--sage)]">
                        Read More →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {canShowMore ? (
              <div className="mt-[22px] flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(() => Math.min(MAX_SHOW_MORE, posts.length))
                  }
                  className="rounded-[12px] bg-[var(--sage)] px-[22px] py-[12px] text-[13.5px] font-semibold text-white shadow-[0_4px_14px_rgba(132,165,157,0.24)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(132,165,157,0.30)]"
                >
                  Show more blogs
                </button>
              </div>
            ) : null}

            {showPagination ? (
              <div className="mt-[22px] flex items-center justify-center gap-[10px]">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-[12px] border border-[var(--border)] bg-transparent px-[16px] py-[10px] text-[13px] font-semibold text-[var(--text2)] transition-colors hover:bg-[rgba(132,165,157,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                <span className="text-[13px] text-[var(--light-text)]">
                  Page {page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-[12px] border border-[var(--border)] bg-transparent px-[16px] py-[10px] text-[13px] font-semibold text-[var(--text2)] transition-colors hover:bg-[rgba(132,165,157,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>

      <Newsletter />
    </>
  );
}
