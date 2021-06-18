const Blog = require('../models/blog');
const User = require('../models/user');
const { validationResult } = require('express-validator/check');

exports.getUser = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            if(!user) {
                return res.redirect('/blog/all');
            }
            Blog.find({userId: req.user._id})
                .then(blog => {
                    res.render('user/profile', {
                        pageTitle: 'My Profile',
                        path: '/user/userName',
                        user: user,
                        editing: false,
                        userId: req.user,
                        blogs: blog
                    })
                })
                .catch(err => {
                    console.log(err);
                })

        })
        .catch(err => {
            console.log(err);
        }) 
}
exports.getEditProfile = (req,res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            if(!user) {
                return res.redirect('/blog/all');
            }
            res.render('user/edit', {
                pageTitle: 'Edit Profile',
                path: '/user/edit',
                user: user,
                userId: req.user,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postEditProfile = (req, res, next) => {
    const userName = req.body.username;
    const email = req.body.email;
    const profilePic = req.user.profilePic;
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('user/edit', {
          path: '/user/edit',
          pageTitle: 'Edit Profile',
          errorMessage: errors.array()[0].msg,
          user: {
            userName: userName,
            email: email,
            profilePic: profilePic,
            _id: req.user._id
          },
          validationErrors: errors.array(),
          userId: req.user
        });
      }


    const userId = req.params.userId;

    User.findById(userId)
        .then(user => {
            user.userName = userName;
            user.email = email;
            return user.save()
        })
        .then(result => {
            console.log('Profile updated!')
            res.redirect(`/user/${userId}`);
        })
        .catch(err => {
            console.log(err);
        })


}