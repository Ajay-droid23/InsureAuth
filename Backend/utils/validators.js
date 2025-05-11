const { body } = require('express-validator');

exports.signupValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];