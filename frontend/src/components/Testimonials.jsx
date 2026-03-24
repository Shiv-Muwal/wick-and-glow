export default function Testimonials() {
  const items = [
    {
      stars: 5,
      text: '"The Lavender Calm candle transformed my evenings. I light it during my reading time and the scent is absolutely divine — not overpowering at all."',
      name: 'Priya Sharma',
      loc: 'Mumbai, India',
      avatar: 'P',
    },
    {
      stars: 5,
      text: '"Gifted the White Oudh candle to my mother on her birthday and she was absolutely thrilled. The packaging alone feels like opening a luxury gift box."',
      name: 'Arjun Mehta',
      loc: 'Delhi, India',
      avatar: 'A',
    },
    {
      stars: 5,
      text: '"I have tried many candle brands but Wick & Glow is on another level. The Floral Clay Candle looks like artwork! So beautiful I almost do not want to burn it."',
      name: 'Sneha Iyer',
      loc: 'Bengaluru, India',
      avatar: 'S',
    },
  ];

  return (
    <section className="bg-[var(--deep)] px-[60px] py-[100px] text-[var(--cream)] max-[1100px]:px-[30px] max-[1100px]:py-[80px]">
      <div className="mb-[52px] text-center">
        <div className="mb-[12px] text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[rgba(247,237,226,0.6)]">
          Customer Love
        </div>
        <h2 className="font-['Playfair_Display',serif] text-[clamp(2rem,3.5vw,3rem)] leading-[1.2] text-[var(--cream)]">
          Words from Our Community
        </h2>
        <div className="mx-auto mt-[20px] h-[2px] w-[60px] rounded-[2px] bg-[linear-gradient(90deg,var(--sage),var(--gold))]" />
      </div>

      <div className="grid grid-cols-3 gap-[28px] max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1">
        {items.map((item) => (
          <div
            key={item.name}
            className="rounded-[20px] border border-[rgba(246,189,96,0.15)] bg-[rgba(247,237,226,0.05)] p-[36px] backdrop-blur-[10px] transition-all hover:-translate-y-[6px] hover:bg-[rgba(247,237,226,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          >
            <div className="mb-[16px] text-[0.9rem] text-[var(--gold)]">{'★'.repeat(item.stars)}</div>
            <p className="mb-[24px] text-[0.95rem] italic leading-[1.8] text-[rgba(247,237,226,0.85)]">
              {item.text}
            </p>
            <div className="flex items-center gap-[14px]">
              <div className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--sage),var(--gold))] font-['Playfair_Display',serif] text-[1.2rem] font-bold text-white">
                {item.avatar}
              </div>
              <div>
                <div className="text-[0.92rem] font-semibold text-[var(--cream)]">{item.name}</div>
                <div className="text-[0.78rem] text-[rgba(247,237,226,0.5)]">{item.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
