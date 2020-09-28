const config = require('config');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Not a valid email address').isEmail(),
    check(
      'password',
      'The password needs to be at least 8 letters long.'
    ).isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure req.body
    const { name, email, password } = req.body;

    try {
      // Check if user exists (check for duplicate emails)
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: `User with the email ${email} already exists.` }],
        });
      }

      // Create new instance of user
      user = new User({
        name,
        email,
        password,
      });

      // Hash the password with bcrypt
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save finalized user object to DB
      await user.save();

      // Return JWT to immediately log the user in
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            console.error(err.message);
            res.status(500).send('Couldnt sign the token');
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
