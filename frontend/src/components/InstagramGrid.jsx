const ITEMS = ['🌸', '🕯️', '🌿', '🌹', '✨', '🏺'];

export default function InstagramGrid() {
  return (
    <section className="py-[80px]">
      <div className="mb-[52px] px-[60px] text-center max-[1100px]:px-[30px]">
        <div className="mb-[12px] text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[var(--sage)]">
          @wickandglow
        </div>
        <h2 className="font-['Playfair_Display',serif] text-[clamp(2rem,3.5vw,3rem)] leading-[1.2] text-[var(--deep)]">
          Follow the Glow
        </h2>
        <div className="mx-auto mt-[20px] h-[2px] w-[60px] rounded-[2px] bg-[linear-gradient(90deg,var(--sage),var(--gold))]" />
      </div>

      <div className="mt-[40px] grid grid-cols-6 gap-[4px] max-[1100px]:grid-cols-3 max-[768px]:grid-cols-2">
        {ITEMS.map((emoji) => (
          <div key={emoji} className="group relative aspect-square cursor-pointer overflow-hidden bg-[var(--blush)]">
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--blush)_0%,#e8c4b8_100%)] text-[2rem] text-[var(--light-text)] transition-transform duration-500 group-hover:scale-[1.08]">
              {emoji}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(44,24,16,0.6)] text-[1.5rem] text-white opacity-0 transition-opacity group-hover:opacity-100">
              📷
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
