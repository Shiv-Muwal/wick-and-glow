import { Link, useParams, Navigate } from 'react-router-dom';

const PAGES = {
  faq: {
    title: 'Frequently asked questions',
    body: (
      <>
        <p><strong>How long does delivery take?</strong> Most orders ship within 2–3 business days. Metro cities often receive orders within 5–7 days after dispatch.</p>
        <p><strong>Do you ship all over India?</strong> We ship to serviceable pincodes across India. Enter your PIN at checkout to confirm.</p>
        <p><strong>Are your candles made with soy wax?</strong> Yes — we use natural soy wax and cotton wicks unless stated otherwise on the product page.</p>
        <p><strong>How do I track my order?</strong> Use the Track order page with your order ID and checkout email, or sign in and open My account.</p>
      </>
    ),
  },
  shipping: {
    title: 'Shipping policy',
    body: (
      <>
        <p>We pack every candle carefully to avoid damage in transit. Shipping charges are shown at checkout (free shipping applies when your order qualifies).</p>
        <p>Once dispatched, you will receive updates by email where available. Delays due to weather or courier issues are outside our control but we will help you follow up.</p>
      </>
    ),
  },
  returns: {
    title: 'Returns & refunds',
    body: (
      <>
        <p>If your order arrives damaged or incorrect, contact us within 48 hours of delivery with photos. We will replace the item or offer a refund as appropriate.</p>
        <p>Because candles are personal-care products, we cannot accept returns for change of mind once the seal is broken or the product has been used.</p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy policy',
    body: (
      <>
        <p>We collect only the information needed to fulfil your order and improve our service: name, email, phone, shipping address, and order history.</p>
        <p>We do not sell your data. Payment for COD orders is collected on delivery; we do not store card details on our servers.</p>
        <p>For questions, email hello@wickandglow.com.</p>
      </>
    ),
  },
  terms: {
    title: 'Terms of use',
    body: (
      <>
        <p>By using this website you agree to provide accurate information at checkout and to use our products only as intended.</p>
        <p>Product images and descriptions are indicative; slight variations in handmade items are normal.</p>
        <p>We may update these terms; continued use of the site means you accept the current version.</p>
      </>
    ),
  },
  'candle-care': {
    title: 'Candle care',
    body: (
      <>
        <p>Trim the wick to about 5 mm before each burn. On the first burn, let the wax melt across the full surface to avoid tunnelling.</p>
        <p>Do not burn for more than 4 hours at a time. Keep away from drafts, children, and pets. Never leave a burning candle unattended.</p>
      </>
    ),
  },
};

export default function LegalPage() {
  const { topic } = useParams();
  const page = PAGES[topic];
  if (!page) return <Navigate to="/" replace />;

  return (
    <article className="px-[60px] py-[100px] max-w-3xl max-[768px]:px-6">
      <div className="text-[0.82rem] text-[var(--light-text)] mb-6">
        <Link to="/" className="text-[var(--sage)] no-underline">Home</Link>
        {' / '}
        <span>{page.title}</span>
      </div>
      <h1 className="font-['Playfair_Display',serif] text-[2rem] text-[var(--deep)] mb-8">{page.title}</h1>
      <div className="legal-prose space-y-5 text-[0.95rem] leading-relaxed text-[var(--light-text)]">
        {page.body}
      </div>
    </article>
  );
}
