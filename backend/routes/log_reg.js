const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const xml2js = require('xml2js');
const axios = require("axios");
const User = require("../models/users");
const authMiddleware = require('../authMiddleware');

const router = express.Router();

const CAS_URL = process.env.CAS_URL; // Ensure this is set in .env
const SERVICE_URL = process.env.SERVICE_URL; // Y
const JWT_SECRET = process.env.JWT_SECRET; // Add your JWT secret to the environment variables
const FRONTEND_URL=process.env.FRONTEND_URL
const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`);
  return response.data.success;
};

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, contactNumber, recaptchaToken } = req.body;

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({ message: "Invalid reCAPTCHA" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      age,
      contactNumber,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return res.status(400).json({ message: "Invalid reCAPTCHA" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/cas/login', (_, res) => {
  console.log('Redirecting to CAS login');
  const loginUrl = `${CAS_URL}/login?service=${encodeURIComponent(SERVICE_URL + '/api/log_reg/cas/callback')}`;
  console.log('Login URL:', loginUrl);
  res.redirect(loginUrl);
});

// ...existing code...

router.get('/cas/callback', async (req, res) => {
  console.log("Entered CAS callback route\n");
  // try {
    const { ticket } = req.query;
    if (!ticket) {
      console.log("No ticket found in query parameters");
      return res.redirect('/?error=no_ticket');
    }
    console.log('Received CAS ticket:', ticket);

    // Validate the CAS ticket
    const userData = await validateCasTicket(ticket);
    console.log('User data from CAS:', userData);

    if (userData) {
      console.log('User is validated');

      // Extract user details from CAS response
      const firstName = userData.attributes['cas:FirstName'][0];
      const lastName = userData.attributes['cas:LastName'][0];
      const email = userData.attributes['cas:E-Mail'][0];
      const contactNumber = '0000000000'; // Default contact number
      const password = 'defaultpassword'; // Default password

      // Find or create the user in the database
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({
          firstName,
          lastName,
          email,
          password,
          age: 20, // Default age
          contactNumber
        });
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

      // Redirect user to complete profile or dashboard
      console.log("hi helo ---");
      res.redirect(`${FRONTEND_URL}/complete-profile?token=${token}&name=${firstName+"-"+lastName}&email=${email}`);
    } else {
      console.log('User validation failed');
      res.redirect(`${FRONTEND_URL}/signup`);
    }
  // } catch (error) {
  //   console.error('CAS authentication error:', error);
  //   res.redirect(`${FRONTEND_URL}/login?error=cas_auth_failed`);
  // }
});

// ...existing code...

async function validateCasTicket(ticket) {
  try {
    console.log('Validating CAS ticket:', ticket);
    const validateUrl = `${CAS_URL}/p3/serviceValidate?service=${encodeURIComponent(SERVICE_URL + '/api/log_reg/cas/callback')}&ticket=${ticket}`;
    console.log('Validation URL:', validateUrl);

    const response = await axios.get(validateUrl);
    console.log('CAS response:', response.data);

    return new Promise((resolve, reject) => {
      xml2js.parseString(response.data, (err, result) => {
        if (err) {
          return reject(err);
        }

        const serviceResponse = result['cas:serviceResponse'];
        if (serviceResponse && serviceResponse['cas:authenticationSuccess']) {
          const success = serviceResponse['cas:authenticationSuccess'][0];
          const user = {
            email: success['cas:user'][0],
            attributes: success['cas:attributes'] ? success['cas:attributes'][0] : {}
          };
          resolve(user);
        } else {
          reject(new Error('CAS Authentication failed'));
        }
      });
    });
  } catch (error) {
    throw new Error(`CAS Validation failed: ${error.message}`);
  }
}
// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, age, contactNumber, password } = req.body;

    const updateData = { firstName, lastName, age, contactNumber };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.user, updateData, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
