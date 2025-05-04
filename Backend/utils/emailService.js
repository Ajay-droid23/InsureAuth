const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const getRegisterMailTemplate = (email) => {
  return transporter.sendMail({
    from: `"Insure LTD" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thanks For Registration',
    html: `<!DOCTYPE html><html lang="en"><head><title>Welcome</title></head><body><h1>Welcome to Insure!</h1><p>You have successfully registered and are now part of the Insure family!</p></body></html>`
  });
};

const sendOTPEmail = (email, otp) => {
  return transporter.sendMail({
    from: `"Insure LTD" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    html: `<div><h2>Your OTP Code</h2><p>Your OTP code is: <strong>${otp}</strong></p><p>It is valid for 5 minutes.</p></div>`
  });
};

module.exports = { getRegisterMailTemplate, sendOTPEmail };
