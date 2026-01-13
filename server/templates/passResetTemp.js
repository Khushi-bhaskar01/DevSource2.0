export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <title>Password Reset - DevSource</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin:0;background:#0c0c0c;font-family:Arial,sans-serif; }
    .wrapper { max-width:480px;margin:60px auto;background:#111;border-radius:14px;overflow:hidden;border:1px solid #ff292994;box-shadow:0 0 25px rgba(255,20,20,.35); }
    .header { background:linear-gradient(145deg,#ff3d3d,#b30000);text-align:center;padding:28px 20px;color:#fff;font-size:22px;font-weight:700;letter-spacing:1px;text-transform:uppercase; }
    .content { padding:30px;color:#eee;font-size:14px;line-height:1.6; }
    .btn { display:block;background:#ff2b2b;padding:12px;text-align:center;margin:24px 0;border-radius:8px;color:#fff;font-size:15px;font-weight:bold;text-decoration:none;box-shadow:0 0 10px rgba(255,0,0,.45); }
    .footer { padding:18px;text-align:center;background:#0a0a0a;color:#777;font-size:12px;border-top:1px solid #222; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">Reset Password</div>
  <div class="content">
    Hi {{name}},<br><br>
    A request was received to reset your password. If this was you, click below to set a new password:<br>
    <a href="{{resetLink}}" class="btn">Reset Password</a>
    This link will expire in <strong>1 hour</strong>.<br><br>
    If you didn't make this request, please ignore this email.
  </div>
  <div class="footer">© ${new Date().getFullYear()} DevSource — All Rights Reserved.</div>
</div>
</body>
</html>
`;
