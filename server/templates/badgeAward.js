export const badgeAwardedTemplate = (user, badge) => `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Badge Awarded | DevSource</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="padding:24px;background:linear-gradient(90deg,#0f172a,#2563eb,#06b6d4);color:#ffffff;text-align:center;">
                <h1 style="margin:0;font-size:22px;">DevSource | ACM Student Chapter</h1>
                <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">University School of Information, Communication and Technology</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 32px;text-align:center;">
                <h2 style="margin:0 0 16px;font-size:22px;color:#111827;">🎉 Congratulations, ${
                  user.name
                }! 🎉</h2>

                <p style="margin:0 0 20px;color:#374151;font-size:16px;line-height:1.6;">
                  You’ve earned a new badge on <strong style="color:#2563eb;">DevSource</strong>!
                </p>

                <div style="display:inline-block;padding:18px 28px;border-radius:10px;background:#f9fafb;border:1px solid #e5e7eb;box-shadow:0 3px 8px rgba(0,0,0,0.05);margin-bottom:24px;">
                  <h3 style="margin:0;font-size:20px;color:#111827;">🏅 ${
                    badge.name
                  }</h3>
                  <p style="margin:8px 0 0;color:#4b5563;font-size:14px;line-height:1.5;">
                    Awarded for ${badge.reason}.
                  </p>
                </div>

                <p style="margin:0 0 22px;color:#374151;line-height:1.6;">
                  Keep up the amazing work and continue contributing to the DevSource community — every step brings you closer to mastery 🚀.
                </p>

                <div style="text-align:center;margin:20px 0;">
                  <a href="${
                    process.env.FRONTEND_URL ||
                    process.env.CLIENT_URL ||
                    "https://dev-source-murex.vercel.app/"
                  }" 
                  target="_blank" 
                  rel="noopener" 
                  style="display:inline-block;padding:12px 24px;background:#2563eb;color:#ffffff;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">
                    View Your Badges
                  </a>
                </div>

                <hr style="border:none;border-top:1px solid #e6e9ee;margin:28px 0;" />

                <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
                  🌟 Keep learning. Keep building. Keep inspiring others through DevSource!
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;">
                <p style="margin:0;">© ${new Date().getFullYear()} DevSource | ACM Student Chapter, USICT</p>
                <p style="margin:2px 0 0;">Celebrating developers who dare to create 💻</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
