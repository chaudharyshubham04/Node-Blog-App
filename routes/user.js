const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');
const User = require('../models/user');

router.get('/:userId', isAuth, userController.getUser);

router.get('/:userId/edit', isAuth, userController.getEditProfile);

router.post('/:userId/edit',[
    body('username')
    .custom((value, { req }) => {
     
      console.log(value);
      //userDoc : { userName: 'akki' }   ,   value ='akki'
        return User.findOne({ userName: value }).then(userDoc => {
          if (userDoc && !userDoc._id.equals(req.user._id)) {
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
        if (userDoc && !userDoc._id.equals(req.user._id)) {
          return Promise.reject(
            'E-Mail exists already, please pick a different one.'
          );
        }
      });
    })
    .normalizeEmail()
], isAuth, userController.postEditProfile);

module.exports = router;
