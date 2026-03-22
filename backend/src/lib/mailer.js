import nodemailer from 'nodemailer';

export function isMailConfigured() {
  return Boolean(
    process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS
  );
}

function createTransport() {
  const pass = String(process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  const port = Number(process.env.EMAIL_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass,
    },
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Sends welcome email after newsletter signup.
 * @returns {Promise<{ sent: boolean; reason?: string }>}
 */
export async function sendNewsletterWelcome(toEmail) {
  if (!isMailConfigured()) {
    return { sent: false, reason: 'not_configured' };
  }

  const from =
    process.env.EMAIL_FROM?.trim() || `Wick & Glow <${process.env.EMAIL_USER}>`;
  const code = process.env.NEWSLETTER_WELCOME_CODE?.trim();

  const bonusHtml = code
    ? `<p style="margin:24px 0;font-size:16px;">Your welcome offer: use code <strong>${escapeHtml(code)}</strong> at checkout for <strong>10% off</strong> your first order.</p>`
    : `<p style="margin:24px 0;font-size:16px;">Watch this inbox for <strong>10% off your first order</strong> and early access to new scents, rituals, and candle care tips.</p>`;

  const text = code
    ? `Thank you for joining Wick & Glow.\n\nUse code ${code} at checkout for 10% off your first order.\n\n— Wick & Glow`
    : `Thank you for joining Wick & Glow.\n\nWe'll send exclusive offers, new scents, and candle care tips to this address.\n\n— Wick & Glow`;

  const html = `<!DOCTYPE html><html><body style="font-family:Georgia,serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="color:#4a6741;">You are on the list</h1>
  <p>Thank you for subscribing to the Wick & Glow newsletter.</p>
  ${bonusHtml}
  <p style="color:#666;font-size:14px;">We are glad you are here.</p>
  <p style="margin-top:32px;font-size:13px;color:#888;">Wick & Glow</p>
  </body></html>`;

  try {
    const transport = createTransport();
    await transport.sendMail({
      from,
      to: toEmail,
      subject: 'Welcome to Wick & Glow',
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] newsletter welcome:', err?.message || err);
    return { sent: false, reason: 'send_failed' };
  }
}
