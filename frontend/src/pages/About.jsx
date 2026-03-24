import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';

export default function About() {
  return (
    <>
      <section className="grid grid-cols-2 items-center gap-[80px] px-[60px] pb-[80px] pt-[140px] max-[1100px]:grid-cols-1 max-[1100px]:gap-[40px] max-[1100px]:px-[30px] max-[1100px]:pt-[120px]">
        <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#f5cac3_0%,#f7ede2_50%,#e8d4b4_100%)] p-[40px]">
          <div className="flex h-[420px] items-center justify-center text-[6rem]">🕯️</div>
          <div className="absolute bottom-[20px] left-[20px] rounded-[14px] bg-white/90 px-[18px] py-[14px] text-center shadow-[0_12px_28px_rgba(44,24,16,0.15)] backdrop-blur-[8px]">
            <div className="font-['Playfair_Display',serif] text-[1.5rem] font-bold text-[var(--deep)]">2019</div>
            <div className="text-[0.72rem] uppercase tracking-[1.2px] text-[var(--light-text)]">
              Founded with Love
            </div>
          </div>
        </div>
        <div>
          <div className="mb-[14px] text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[var(--sage)]">
            Our Story
          </div>
          <h1 className="font-['Playfair_Display',serif] text-[clamp(2rem,4vw,3.4rem)] leading-[1.2] text-[var(--deep)]">
            Born from a <em className="italic text-[var(--sage)]">Flicker</em> of Passion
          </h1>
          <p className="mt-[18px] text-[0.95rem] leading-[1.85] text-[var(--light-text)]">
            Wick &amp; Glow began in a small Mumbai kitchen in 2019, when founder Kavya Nair
            could not find candles that were both truly natural and genuinely beautiful. She
            started making her own — slowly, intentionally, with love.
          </p>
          <p className="mt-[16px] text-[0.95rem] leading-[1.85] text-[var(--light-text)]">
            What started as a weekend hobby quickly grew into a movement. Word spread through
            social media, friends, and family. Each candle was different, each one carried a
            story. Today, Wick &amp; Glow serves customers across India.
          </p>
          <div className="mt-[36px] flex flex-wrap gap-[16px]">
            <Link
              to="/shop"
              className="inline-flex rounded-[999px] bg-[var(--deep)] px-[34px] py-[14px] text-[0.8rem] font-semibold uppercase tracking-[1.4px] text-[var(--cream)] no-underline transition hover:bg-[var(--gold)] hover:text-[var(--deep)]"
            >
              Shop Our Candles
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-[999px] border-[1.5px] border-[rgba(132,165,157,0.35)] px-[34px] py-[14px] text-[0.8rem] font-semibold uppercase tracking-[1.4px] text-[var(--text)] no-underline transition hover:border-[var(--sage)] hover:bg-[var(--sage)] hover:text-white"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
