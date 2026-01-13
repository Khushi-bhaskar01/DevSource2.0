export const welcomeMail = (name, email) => ({
  from: process.env.SENDER_EMAIL,
  to: email,
  subject: "🎉 Welcome to DevSource | ACM Student Chapter",
  text: `Hello ${name},

Welcome to DevSource — the official ACM Student Chapter of USICT!

We’re thrilled to have you as part of our growing developer community. Your account has been successfully created using: ${email}

🚀 Explore learning resources, coding challenges, and exclusive ACM events — all designed to help you grow as a developer and collaborator.

Get started by visiting:
${
  process.env.FRONTEND_URL ||
  process.env.CLIENT_URL ||
  "https://dev-source-murex.vercel.app/"
}

If you ever need help, feel free to reply to this email.

Let’s build. Let’s innovate. Let’s grow together.

Best regards,  
The DevSource ACM Team
`,

  html: `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>Welcome to DevSource</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="padding:28px;background:linear-gradient(90deg,#0f172a,#2563eb,#06b6d4);color:#ffffff;text-align:center;">
                  <h1 style="margin:0;font-size:24px;letter-spacing:0.5px;">DevSource | ACM Student Chapter</h1>
                  <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">University School of Information, Communication and Technology</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Welcome, ${name}! 🎉</h2>
                  <p style="margin:0 0 16px;color:#374151;line-height:1.6;">
                    We’re thrilled to welcome you to <strong>DevSource</strong> — the official <strong>ACM Student Chapter of USICT</strong>. 
                    You’ve joined a passionate community of developers, innovators, and problem-solvers.
                  </p>

                  <p style="margin:0 0 20px;color:#374151;line-height:1.6;">
                    Your registered email: <strong style="color:#111827;">${email}</strong>
                  </p>

                  <p style="margin:0 0 24px;color:#374151;line-height:1.6;">
                    Get started by exploring coding challenges, project collaborations, tech workshops, and exclusive ACM events.
                  </p>

                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td align="center">
                        <a href="${
                          process.env.FRONTEND_URL ||
                          process.env.CLIENT_URL ||
                          "https://dev-source-murex.vercel.app/"
                        }" target="_blank" rel="noopener" 
                        style="display:inline-block;padding:12px 24px;background:#2563eb;color:#ffffff;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">
                          Visit DevSource
                        </a>
                      </td>
                    </tr>
                  </table>

                  <hr style="border:none;border-top:1px solid #e6e9ee;margin:28px 0;" />

                  <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.5;">
                    💬 Need help or have questions? Reach out to us at 
                    <a href="mailto:${
                      process.env.SUPPORT_EMAIL || process.env.SENDER_EMAIL
                    }" style="color:#2563eb;text-decoration:none;font-weight:500;">
                      ${process.env.SUPPORT_EMAIL || process.env.SENDER_EMAIL}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:18px 28px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;">
                  <p style="margin:0;">© ${new Date().getFullYear()} DevSource | ACM Student Chapter, USICT</p>
                  <p style="margin:2px 0 0;">Building a community of learners and innovators 💻</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`,
});
