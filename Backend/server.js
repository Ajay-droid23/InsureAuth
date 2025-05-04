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


function getRegisterMailTemplate(email,role) {
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
    await getRegisterMailTemplate(email,role);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

