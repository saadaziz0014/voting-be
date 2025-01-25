function template(otp, reason, time) {
    return (`
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Verification</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0;
        background-color: #f4f4f9; } .container { max-width: 600px; margin: 20px
        auto; padding: 20px; background: #ffffff; border-radius: 10px; box-shadow:
        0 2px 10px rgba(0, 0, 0, 0.1); } .header { text-align: center;
        margin-bottom: 20px; } .header h1 { color: #333333; } .content {
        text-align: center; font-size: 16px; line-height: 1.5; color: #555555; }
        .otp-box { display: inline-block; margin: 20px 0; padding: 10px 20px;
        background-color: #e9f5ff; color: #0056b3; font-weight: bold; font-size:
        20px; border-radius: 5px; } .footer { margin-top: 20px; font-size: 12px;
        text-align: center; color: #888888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Voting App OTP</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Your OTP For:</p>
          <p><strong>${reason}</strong></p>
          <p>Your OTP is:</p>
          <div class="otp-box">${otp}</div>
          <p>
            Please use this OTP to complete your request. This OTP will expire in
            ${time}
            minutes.
          </p>
        </div>
        <div class="footer">
          <p>If you did not request this OTP, please ignore this email.</p>
          <p>Thank you for using Voting App!</p>
        </div>
      </div>
    </body>
  </html>`)
}

export default template


