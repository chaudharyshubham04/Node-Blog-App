const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');
const User = require('../models/user');


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/signup',[
    body('username')
    .custom((value, { req }) => {
        return User.findOne({ userName: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'User name exists already, please pick a different one.'
            );
          }
        });
      }),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password with at least 6 characters.'
    )
      .isLength({ min: 6 })
      .trim(),
    body('confirmpassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],authController.postSignup);

router.post('/login',
[
  body('password', 'wrong password')
    .isLength({ min: 6 })
    .trim()
],authController.postLogin);

router.post('/logout', authController.getLogout);

router.get('/resetPassword', authController.getResetPassword);

router.post('/resetPassword', authController.postResetPassword);

router.get('/reset/:token', authController.getNewPassword);

router.get('/new-password', authController.getNewPassword);

router.post('/new-password',[
body('password','Please enter a password with at least 6 characters.')
    .isLength({min: 6})
    .trim()
],authController.postNewPassword);

module.exports = router;