import React, { useEffect, useState } from 'react';
import { fetchAdminReviews } from '../api/client.js';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAdminReviews();
        if (!cancelled) setReviews(data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fallback = [
    {
      initials: 'PS',
      name: 'Priya Sharma',
      bg: '#84a59d',
      stars: '★★★★★',
      date: 'Jan 15, 2024',
      text: 'Absolutely love the Rose Aroma Candle! The fragrance fills the entire room and lasts for hours. Will definitely order again.',
    },
    {
      initials: 'RV',
      name: 'Rohit Verma',
      bg: '#f6bd60',
      stars: '★★★★☆',
      date: 'Jan 16, 2024',
      text: 'Sandalwood Bliss is truly blissful! Great packaging too. Only wish the burn time was a bit longer.',
    },
  ];

  const list =
    reviews.length > 0
      ? reviews.map((r) => ({
          initials: r.initials,
          name: r.name,
          bg: r.bg,
          stars: r.stars,
          date: r.date,
          text: r.text,
        }))
      : fallback;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-['DM_Serif_Display',serif] text-[20px] text-[var(--text)]">
            Reviews
          </h2>
          <p className="mt-[2px] text-[12.5px] text-[var(--text2)]">
            Customer reviews and feedback
            {error ? (
              <span className="ml-2 text-[#b45309]">({error} — showing sample data)</span>
            ) : null}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-[14px]">
        {list.map((r) => (
          <div
            key={`${r.name}-${r.date}`}
            className="rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)]"
          >
            <div className="mb-[10px] flex items-center gap-[12px]">
              <div
                className="flex h-[37px] w-[37px] flex-shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                style={{ background: r.bg }}
              >
                {r.initials}
              </div>
              <div>
                <div className="text-[var(--text)]">{r.name}</div>
                <div className="text-[15px] tracking-[0.2em] text-[var(--gold)]">
                  {r.stars}
                </div>
              </div>
              <div className="ml-auto text-[11px] text-[var(--text2)]">{r.date}</div>
            </div>
            <div className="text-[13px] italic text-[var(--text2)]">
              &quot;{r.text}&quot;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
