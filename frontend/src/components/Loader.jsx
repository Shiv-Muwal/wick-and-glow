import { useState, useEffect } from 'react';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="loader" className={hidden ? 'hidden' : ''}>
      <div className="loader-candle-wrap">
        <div className="loader-glow-outer" />
        <div className="loader-glow-inner" />
        <div className="loader-candle">
          <div className="loader-flame-wrap">
            <div className="loader-flame-outer" />
            <div className="loader-flame-mid" />
            <div className="loader-flame-core" />
          </div>
          <div className="loader-wick" />
          <div className="loader-body">
            <div className="loader-label">LUMIÈRE</div>
          </div>
        </div>
      </div>
      <div className="loader-text">Lumière</div>
      <div className="loader-subtext">Handcrafted Candles</div>
    </div>
  );
}
