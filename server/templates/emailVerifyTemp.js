export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html>

<head>
  <title>Verify Email - DevSource</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      margin: 0;
      background: #0c0c0c;
      font-family: Arial, sans-serif;
    }

    .wrapper {
      max-width: 480px;
      margin: 60px auto;
      background: #111;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #ff292994;
      box-shadow: 0 0 25px rgba(255, 20, 20, 0.35);
    }

    .header {
      text-align: center;
      background: linear-gradient(145deg, #ff3d3d, #b30000);
      padding: 30px 20px;
    }

    .header img {
      width: 85px;
      margin-bottom: 10px;
    }

    .header h1 {
      margin: 0;
      color: #fff;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .content {
      padding: 32px 30px;
      color: #f2f2f2;
      font-size: 14px;
      line-height: 1.6;
    }

    .email-highlight {
      color: #ff3d3d;
      font-weight: bold;
    }

    .otp {
      margin-top: 26px;
      padding: 14px 0;
      background: #ff2b2b;
      font-size: 24px;
      text-align: center;
      border-radius: 8px;
      letter-spacing: 4px;
      font-weight: bold;
      color: #fff;
      box-shadow: 0 0 12px rgba(255, 0, 0, 0.45);
    }

    .footer {
      text-align: center;
      padding: 18px;
      font-size: 12px;
      background: #0a0a0a;
      color: #777;
      border-top: 1px solid #222;
    }
  </style>
</head>

<body>

  <div class="wrapper">
    <div class="header">
      <img src="https://i.ibb.co/mrV0t5Wy/devsource-logo-1.png" alt="DevSource Logo" />
      <h1>DevSource Verification</h1>
    </div>

    <div class="content">
      Hello! 👋<br><br>

      To proceed, we need to verify your email:
      <br><span class="email-highlight">{{email}}</span>

      <div class="otp">{{otp}}</div>

      This code is valid for <strong>24 hours</strong>.<br><br>
      If you didn’t request this, you can safely ignore this message.
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} DevSource — All Rights Reserved.
    </div>
  </div>

</body>

</html>
`;
