const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// otp mail template
exports.sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Insure LTD" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
              <h2 style="color:rgb(131, 54, 154); text-align: center;">Your OTP Code</h2>
              <p style="font-size: 16px; color: #333;">Hello,</p>
              <p style="font-size: 16px; color: #333;">Your OTP code is:</p>
              <div style="text-align: center; margin: 20px 0; padding: 10px; background-color: #e0f7fa; border-radius: 5px;">
                  <span style="font-size: 24px; font-weight: bold; color:rgb(131, 54, 154);">${otp}</span>
              </div>
              <p style="font-size: 16px; color: #333;">It is valid for 5 minutes.</p>
              <p style="font-size: 16px; color: #333;">If you did not request this code, please ignore this email.</p>
              <div style="text-align: center; margin-top: 20px;">
                  <a href="https://yourwebsite.com" style="font-size: 16px; color:rgb(131, 54, 154); text-decoration: none;">Visit our website</a>
              </div>
          </div>`
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};	 

//
exports.getRegisterMailTemplate = (email, role) => {
    const greeting = role === 'agent' ? 'Agent' : 'Customer'
  return transporter.sendMail({
    from:`"Insure LTD" <${process.env.EMAIL_USER}>`,
    to:email,
    subject:'Thanks For Registration',
    html:`
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Insure LTD</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color:rgba(120, 0, 189, 0.79);
            color: #ffffff;
            padding: 20px;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #333333;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color:rgba(120, 0, 189, 0.79);
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Insure LTD!</h1>
        </div>
        <div class="content">
            <p>Dear ${greeting},</p>
            <p>Thank you for registering with Insure LTD. We are thrilled to have you as part of our community!</p>
            <p>At Insure LTD, we strive to provide the best insurance solutions tailored to your needs. Whether you're looking for vehicle insurance, health insurance, or any other type of coverage, we've got you covered.</p>
            <a href="https://yourwebsite.com" class="button">Explore Our Services</a>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact us at <a href="mailto:insureforone@gmail.com">insureforone@gmail.com</a>.</p>
            <p>Follow us on <a href="https://facebook.com">Facebook</a> | <a href="https://twitter.com">Twitter</a> | <a href="https://instagram.com">Instagram</a></p>
        </div>
    </div>
</body>
</html>
`
  });
};


exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiry = Date.now() + 5 * 60 * 1000;

  try {
    let user = await User.find({ email });

    // Check if user already exists with complete registration
    if (user && user.name && user.password) {
      return res.status(400).send('User already exists');
    }

    if (user) {
      user = new User({
        email,
        otp,
        otpExpiry,
        verified: false
      });
    } else {
      // Reset OTP if the user exists but hasn't completed registration
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.verified = false;
    }

    await user.save();
    await sendOTPEmail(email, otp);

    res.status(200).send('OTP sent to email.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending OTP');
  }
};