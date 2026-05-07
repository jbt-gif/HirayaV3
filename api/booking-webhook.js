export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { triggerEvent, payload } = req.body;

    if (triggerEvent !== 'BOOKING_CREATED') return res.status(200).json({ ok: true });

    const attendee   = payload.attendees?.[0];
    const name       = attendee?.name || 'there';
    const email      = attendee?.email;
    const startTime  = new Date(payload.startTime);
    const locationRaw = payload.location || '';
    const meetingUrl = locationRaw.startsWith('http')
      ? locationRaw
      : (payload.metadata?.videoCallUrl || payload.videoCallData?.url || '');
    const notes      = payload.additionalNotes || payload.notes || '';

    if (!email) return res.status(400).json({ error: 'No attendee email' });

    const dateStr = startTime.toLocaleString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });

    const reminderTime = new Date(startTime.getTime() - 2 * 60 * 60 * 1000);

    // Email 1 — Booking Confirmation (sent immediately)
    const confirmationHtml = `
      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;background:#000;color:#f0ede8;padding:40px 32px;border-radius:12px;">
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:32px;">Hiraya Systems</div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;">You're booked, ${name}.</h1>
        <p style="color:rgba(255,255,255,0.55);font-size:14px;margin:0 0 32px;">Your discovery call with Hiraya Systems is confirmed.</p>

        <div style="background:#0f0f0f;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 24px;margin-bottom:32px;">
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:6px;">📅 Date &amp; Time</div>
          <div style="font-size:15px;font-weight:600;">${dateStr}</div>
          ${meetingUrl ? `
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:16px;margin-bottom:6px;">🔗 Join Link</div>
          <a href="${meetingUrl}" style="color:#2dd4bf;font-size:14px;word-break:break-all;">${meetingUrl}</a>` : ''}
        </div>

        <p style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 12px;">Here's what to expect in our 30 minutes together:</p>
        <p style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 32px;">We'll review what you shared, map the exact workflow we'd build for your situation, and walk you through a rough scope and timeline — no pressure, no pitch deck. You don't need to prepare anything. Just show up ready to talk about your operation.</p>

        ${notes ? `
        <div style="background:#0f0f0f;border:1px solid rgba(45,212,191,0.15);border-left:3px solid #2dd4bf;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:32px;">
          <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#2dd4bf;margin-bottom:10px;">What you shared with Scout</div>
          <pre style="font-family:inherit;font-size:13px;color:rgba(255,255,255,0.6);white-space:pre-wrap;margin:0;line-height:1.6;">${notes}</pre>
        </div>` : ''}

        <p style="font-size:14px;color:rgba(255,255,255,0.7);margin:0 0 4px;">See you then.</p>
        <p style="font-size:14px;color:rgba(255,255,255,0.7);margin:0 0 32px;">— John<br><span style="color:rgba(255,255,255,0.4);">Hiraya Systems · raya.teams@hirayasystems.tech</span></p>

        <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:20px;font-size:11px;color:rgba(255,255,255,0.25);">
          You're receiving this because you booked a call at hirayasystems.tech
        </div>
      </div>`;

    // Email 2 — 2-Hour Reminder (scheduled)
    const reminderHtml = `
      <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;background:#000;color:#f0ede8;padding:40px 32px;border-radius:12px;">
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:32px;">Hiraya Systems</div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;">Your call is in 2 hours.</h1>
        <p style="color:rgba(255,255,255,0.55);font-size:14px;margin:0 0 32px;">Hi ${name} — just a quick reminder for your Hiraya discovery call.</p>

        <div style="background:#0f0f0f;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 24px;margin-bottom:32px;">
          <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:6px;">📅 Date &amp; Time</div>
          <div style="font-size:15px;font-weight:600;">${dateStr}</div>
          ${meetingUrl ? `
          <div style="margin-top:20px;">
            <a href="${meetingUrl}" style="display:inline-block;background:#2dd4bf;color:#000;font-size:13px;font-weight:700;padding:10px 22px;border-radius:8px;text-decoration:none;letter-spacing:0.03em;">Join Call →</a>
          </div>` : ''}
        </div>

        <p style="font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7;margin:0 0 32px;">We'll be covering the situation you described — no prep needed on your end. See you shortly.</p>

        <p style="font-size:14px;color:rgba(255,255,255,0.7);margin:0 0 4px;">— John</p>
        <p style="font-size:14px;color:rgba(255,255,255,0.4);margin:0 0 32px;">Hiraya Systems · raya.teams@hirayasystems.tech</p>

        <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:20px;font-size:11px;color:rgba(255,255,255,0.25);">
          You're receiving this because you booked a call at hirayasystems.tech
        </div>
      </div>`;

    const FROM = 'John - Hiraya Systems <raya.teams@hirayasystems.tech>';

    const [conf, remind] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: email, subject: `You're booked — here's what happens next, ${name}`, html: confirmationHtml })
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to: email, subject: `Your call is in 2 hours — join link inside`, html: reminderHtml, scheduled_at: reminderTime.toISOString() })
      })
    ]);

    const confData   = await conf.json();
    const remindData = await remind.json();

    if (!conf.ok || !remind.ok) {
      console.error('Resend error:', confData, remindData);
      return res.status(500).json({ error: 'Email send failed', confData, remindData });
    }

    res.status(200).json({ ok: true, confirmation: confData.id, reminder: remindData.id });

  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
