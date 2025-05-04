const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');


dotenv.config();
const app = express();
const port = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  vehicleno: String,
  gender: String,
  role: String,
  password: String,
  otp: String,
  otpExpiry: Date,
  resetPasswordOTP: String,
  resetPasswordOTPExpiry: Date, 
  resetPasswordVerified: { type: Boolean, default: false },
  verified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const generateOTP = (length = 6) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


function getRegisterMailTemplate(email) {
  
  return transporter.sendMail({
    from:`"Insure LTD" <${process.env.EMAIL_USER}>`,
    to:email,
    subject:'Thanks For Registration',
    html:`
  <!DOCTYPE html><html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;700;900&amp;display=swap" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&amp;display=swap" rel="stylesheet" type="text/css"><!--<![endif]--><style> *{box-sizing:border-box}body{margin:0;padding:0}a[x-apple-data-detectors]{color:inherit !important;text-decoration:inherit !important}#MessageViewBody a{color:inherit;text-decoration:none}p{line-height:inherit}.desktop_hide,.desktop_hide table{mso-hide:all;display:none;max-height:0;overflow:hidden}.image_block img+div{display:none}@media (max-width:720px){.social_block.desktop_hide .social-table{display:inline-block !important}.mobile_hide{display:none}.row-content{width:100% !important}.stack .column{width:100%;display:block}.mobile_hide{min-height:0;max-height:0;max-width:0;overflow:hidden;font-size:0}.desktop_hide,.desktop_hide table{display:table !important;max-height:none !important}.row-2 .column-1 .block-1.text_block td.pad,.row-2 .column-1 .block-2.text_block td.pad{padding:10px 5px 5px !important}.row-3 .column-1 .block-1.spacer_block{height:20px !important}}</style></head><body style="background-color:#fff;margin:0;padding:0;-webkit-text-size-adjust:none;text-size-adjust:none"><table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#fff"><tbody><tr><td><table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#7700bd;background-size:auto"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-size:auto;border-radius:0;color:#000;width:700px;margin:0 auto" width="700"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:30px;padding-top:30px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad"><div style="font-family:Arial,sans-serif"><div class
  style="font-size:12px;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;mso-line-height-alt:14.399999999999999px;color:#fff;line-height:1.2"><p
  style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="font-size:30px;"><strong>Welcome
                                                                                      to Insure!</strong></span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:700px;margin:0 auto" width="700"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:25px;padding-top:25px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><table class="text_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad" style="padding-bottom:15px;padding-left:5px;padding-right:5px;padding-top:20px"><div
  style="font-family:'Trebuchet MS',Tahoma,sans-serif"><div class
  style="font-size:14px;font-family:Montserrat,'Trebuchet MS','Lucida Grande','Lucida Sans Unicode','Lucida Sans',Tahoma,sans-serif;mso-line-height-alt:16.8px;color:#8400d1;line-height:1.2"><p
  style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span
  style="font-size:30px;"><strong></strong></span></p></div></div></td></tr></table><table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad" style="padding-bottom:5px;padding-left:5px;padding-right:5px;padding-top:10px"><div style="font-family:Arial,sans-serif"><div class
  style="font-size:12px;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;mso-line-height-alt:14.399999999999999px;color:#555;line-height:1.2"><p
  style="margin:0;font-size:12px;text-align:center;mso-line-height-alt:14.399999999999999px"><span style="font-size:15px;">You have
                                                                                  successfully registered, </span></p><p
  style="margin:0;font-size:12px;text-align:center;mso-line-height-alt:14.399999999999999px"><span style="font-size:15px;">and you are
                                                                                  now one of the Insure
                                                                                  family!</span></p></div></div></td></tr></table><div class="spacer_block block-3" style="height:60px;line-height:60px;font-size:1px">&#8202;</div><table class="text_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tr><td class="pad"><div style="font-family:Arial,sans-serif"><div class
  style="font-size:12px;font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;mso-line-height-alt:14.399999999999999px;color:#171717;line-height:1.2"><p
  style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span style="font-size:12px;"><strong>Our
                                                                                      mailing address:</strong></span></p><p
  style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><span
  style="font-size:12px;">insureforone@gmail.com</span></p></div></div></td></tr></table></td></tr></tbody></table></td></tr></tbody></table><table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#7500ba"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;color:#000;width:700px;margin:0 auto" width="700"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:25px;padding-top:25px;vertical-align:top;border-top:0;border-right:0;border-bottom:0;border-left:0"><div class="spacer_block block-1" style="height:60px;line-height:60px;font-size:1px">&#8202;</div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`
  });
}

function sendOTPEmail(email, otp) {
  return transporter.sendMail({
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
  });
}


// Configure storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/profile-pictures');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
userSchema.add({
  profilePicture: String
});





app.put('/user/:email/change-password', authenticateJWT, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (req.params.email !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== oldPassword) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error changing password' });
  }
});



const secretKey = process.env.JWT_SECRET || 'your-very-secure-secret-key';

// Add this middleware to verify JWT tokens


app.put('/user/:email', authenticateJWT, upload.single('profilePicture'), async (req, res) => {
  try {
    if (req.params.email !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.vehicleno) updates.vehicleno = req.body.vehicleno;
    if (req.body.gender) updates.gender = req.body.gender;
    if (req.file) updates.profilePicture = `/profile-pictures/${req.file.filename}`;

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: updates },
      { new: true }
    );

    res.json({
      name: user.name,
      email: user.email,
      vehicleno: user.vehicleno,
      gender: user.gender,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});
// Modify your login route to return a JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      // Create a JWT token
      const token = jwt.sign(
        { 
          email: user.email,
          role: user.role 
        },
        secretKey,
        { expiresIn: '1h' }
      );
      
      res.status(200).json({ 
        role: user.role,
        user: {
          name: user.name,
          email: user.email,
          vehicleno: user.vehicleno,
          gender: user.gender,
        },
        token // Send the token to the client
      });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// Protect your user route with JWT middleware
app.get('/user/:email', authenticateJWT, async (req, res) => {
  try {
    // Verify the requested email matches the token's email
    if (req.params.email !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      name: user.name,
      email: user.email,
      vehicleno: user.vehicleno,
      gender: user.gender,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});



// Password Reset Endpoints
app.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending OTP' });
  }
});

app.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpiry = null;
    user.resetPasswordVerified = true;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying OTP' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      resetPasswordVerified: true 
    });

    if (!user) {
      return res.status(400).json({ error: 'OTP not verified or session expired' });
    }

    user.password = password;
    user.resetPasswordVerified = false;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
});


app.post('/send-otp', async (req, res) => {
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
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.otp === otp && user.otpExpiry > Date.now()) {
      user.verified = true;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      res.status(200).send('OTP verified successfully');
    } else {
      res.status(400).send('Invalid or expired OTP');
    }
  } catch (error) {
    res.status(500).send('Error verifying OTP');
  }
});


app.post('/signup', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const { name, email, vehicleno, gender, role, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send('OTP not sent.');
    if (!user.verified) return res.status(403).send('OTP not verified.');

  

    user.name = name;
    user.vehicleno = vehicleno;
    user.gender = gender;
    user.role = role;
    user.password = password;
    await user.save();

    res.status(201).send('User registered successfully');
    await getRegisterMailTemplate(email);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

