import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-[120px] pb-[60px] px-[60px] bg-[linear-gradient(135deg,var(--cream)_0%,#fae8d8_50%,#f0d4c0_100%)] max-[1100px]:flex-col max-[1100px]:text-center max-[1100px]:gap-[60px] max-[1100px]:px-[30px] ">
      <div className="absolute  w-[400px] h-[400px] bg-[var(--blush)] top-[-10%] right-[20%] rounded-full blur-[80px] opacity-40 z-[1]" />
      <div className="absolute  w-[300px] h-[300px] bg-[rgba(132,165,157,0.3)] bottom-[10%] right-[10%] rounded-full blur-[80px] opacity-40 z-[1]" />
      <div className="absolute  w-[200px] h-[200px] bg-[rgba(246,189,96,0.2)] top-[30%] left-[5%] rounded-full blur-[80px] opacity-40 z-[1]" />

      <div className="flex-1 max-w-[580px] z-[2] reveal">
        <div className="flex items-center gap-3 mb-5 text-[0.75rem] tracking-[4px] uppercase font-semibold text-[var(--sage)] before:content-[''] before:w-[30px] before:h-[1px] before:bg-[var(--sage)] before:inline-block">Since 2019 · Handcrafted with Love</div>
        <h1 className="font-['Playfair_Display',serif] 
text-[clamp(2.8rem,5vw,4.5rem)] 
leading-[1.15] 
text-[var(--deep)] 
mb-[24px]">Handcrafted <em className="italic text-[var(--sage)]">Luxury</em><br />Candles</h1>
        <p className="text-[1rem] leading-[1.8] text-[var(--light-text)] mb-[40px] max-w-[420px]">
          Each flame tells a story. Our small-batch soy candles are lovingly made with premium
          fragrances, natural wax, and designs that transform any space into a sanctuary.
        </p>
        <div className="flex gap-4 flex-wrap max-[1100px]:justify-center">
          <Link to="/shop" className="btn-primary">Shop Now →</Link>
          <Link to="/about" className="btn-secondary">Our Story</Link>
        </div>
        <div className="flex gap-[40px] mt-[50px] pt-[40px] border-t border-[rgba(132,165,157,0.2)] max-[1100px]:justify-center max-[768px]:flex-wrap">
          <div className="text-center"><span className="font-['Playfair_Display',serif] text-[2rem] font-bold text-[var(--deep)] block">12K+</span><span className="text-[0.75rem] text-[var(--light-text)] tracking-[1px]">Happy Customers</span></div>
          <div className="text-center"><span className="font-['Playfair_Display',serif] text-[2rem] font-bold text-[var(--deep)] block">40+</span><span className="text-[0.75rem] text-[var(--light-text)] tracking-[1px]">Scents</span></div>
          <div className="text-center"><span className="font-['Playfair_Display',serif] text-[2rem] font-bold text-[var(--deep)] block">100%</span><span className="text-[0.75rem] text-[var(--light-text)] tracking-[1px]">Natural Soy</span></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-[2]">
        <div className="float-el">
          <div className="mini-candle" style={{ background: 'linear-gradient(180deg,#f5cac3,#e8a090)' }} />
        </div>
        <div className="float-el">
          <div className="mini-candle" style={{ background: 'linear-gradient(180deg,#84a59d,#6a8f87)' }} />
        </div>

        <div className="[perspective:800px] w-[340px] h-[500px] flex items-center justify-center">
          <div className="[transform-style:preserve-3d] relative animate-[floatCandle_6s_ease-in-out_infinite,rotateCandle_12s_linear_infinite]">
            <div className="absolute w-[180px] h-[180px] 
bg-[radial-gradient(circle,rgba(246,189,96,0.3)_0%,transparent_70%)] 
rounded-full 
top-1/2 left-1/2 
-translate-x-1/2 -translate-y-[70%] 
animate-[glowPulse_3s_ease-in-out_infinite]" />
            <div className="absolute top-[-70px] left-1/2 -translate-x-1/2">
              <div className="w-[28px] h-[50px] 
bg-[linear-gradient(180deg,#fff9c4_0%,#f6bd60_40%,#e07b39_70%,transparent_100%)] 
rounded-[50%_50%_20%_20%] 
animate-[flicker_0.8s_ease-in-out_infinite_alternate] 
blur-[1px] 
shadow-[0_0_15px_#f6bd60,0_0_30px_rgba(246,189,96,0.6),0_0_60px_rgba(224,123,57,0.3)]">
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[12px] h-[24px] 
bg-gradient-to-b from-white to-[#fff9c4] 
rounded-[50%_50%_20%_20%] blur-[0.5px]" />
              </div>
            </div>
            <div className="candle-wick" />
            <div className="relative w-[100px] h-[200px] rounded-[12px_12px_20px_20px] 
bg-[linear-gradient(180deg,#f7ede2_0%,#f0c8b0_40%,#e8a888_100%)]
shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1),inset_20px_0_40px_rgba(255,255,255,0.3),0_30px_60px_rgba(44,24,16,0.3)]

before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 
before:h-[15px] before:bg-[var(--cream)] before:rounded-full 
before:-translate-y-1/2 before:scale-x-[1.1]

after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 
after:h-[20px] after:bg-[rgba(44,24,16,0.1)] after:rounded-full 
after:blur-[10px] after:translate-y-full after:scale-x-[1.5]">
              <div className="absolute w-[8px] bg-[rgba(247,237,226,0.9)] rounded-b-[6px] 
top-[10px] left-[15px] h-[30px] 
animate-[drip_4s_ease-in-out_infinite] [animation-delay:0s]" />
              <div className="absolute w-[8px] bg-[rgba(247,237,226,0.9)] rounded-b-[6px] 
top-[5px] right-[20px] h-[20px] 
animate-[drip_4s_ease-in-out_infinite] [animation-delay:1.5s]" />
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
