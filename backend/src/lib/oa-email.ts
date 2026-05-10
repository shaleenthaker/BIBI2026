type OAEmailParams = {
  candidateName: string;
  roleTitle: string;
  topProjectName: string;
  oaUrl: string;
  expiresHours: number;
};

export function buildOAEmail(p: OAEmailParams): { subject: string; html: string } {
  const subject = `Your assessment for ${p.roleTitle} — ${p.topProjectName} caught our eye`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; background: #0d1117; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #e6edf3; }
    .wrap { max-width: 560px; margin: 40px auto; padding: 0 24px 48px; }
    .logo { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; color: #7c3aed; text-transform: uppercase; margin-bottom: 32px; }
    h1 { font-size: 22px; font-weight: 600; color: #f0f6fc; margin: 0 0 16px; line-height: 1.3; }
    p { font-size: 15px; line-height: 1.6; color: #8b949e; margin: 0 0 16px; }
    p strong { color: #e6edf3; }
    .cta { display: inline-block; margin: 24px 0; padding: 12px 28px; background: #7c3aed; color: #fff !important; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600; }
    .meta { font-size: 13px; color: #6e7681; margin-top: 8px; }
    hr { border: none; border-top: 1px solid #21262d; margin: 32px 0; }
    .footer { font-size: 12px; color: #6e7681; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">Sniper</div>

    <h1>Hi ${p.candidateName} — we saw <strong>${p.topProjectName}</strong>.</h1>

    <p>
      We're hiring for <strong>${p.roleTitle}</strong> and your project stood out.
      We source candidates from Devpost and GitHub before wins go viral on LinkedIn — you're one of a small batch we reached out to today.
    </p>

    <p>
      The assessment takes <strong>15–20 minutes</strong>: a few role-specific questions and one short free-response prompt tied to your work. No trick questions.
    </p>

    <a href="${p.oaUrl}" class="cta">Start assessment →</a>

    <p class="meta">Link expires in ${p.expiresHours} hours. One-time use.</p>

    <hr />

    <p class="footer">
      You're receiving this because your Devpost profile matched our search criteria.
      If this isn't the right fit, no action needed — the link simply expires.
    </p>
  </div>
</body>
</html>`;

  return { subject, html };
}
