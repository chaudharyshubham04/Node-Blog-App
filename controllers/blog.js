const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');
const { validationResult } = require('express-validator/check');

exports.getAddBlog = (req, res, next) => {
    res.render('blog/addBlog', {
        pageTitle: 'Add Blog',
        path: '/blog/addBlog',
        editing: false,
        userId: req.user,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}

exports.postAddBlog = (req, res, next) => {
    const title = req.body.title;
    const description = req.body.description;
    const content = req.body.content;
    const category = req.body.category;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('blog/addBlog', {
          pageTitle: 'Add new Blog',
          path: '/blog/addBlog',
          editing: false,
          hasError: true,
          blog: {
            title: title,
            description: description,
            content: content,
            category: category,
          },
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array(),
          userId: req.user
        });
      }

    const blog = new Blog({
        title: title,
        description: description,
        content: content,
        category: category,
        userId: req.user
    })
    blog.save()
        .then(result =>{
            console.log('blog added!');
            res.redirect('/blog/all');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getAll = (req, res, next) => {
    Blog.find()
    .then(blogs => {
        console.log(blogs);
        res.render('blog/all', {
            pageTitle: 'Home',
            path: '/blog/all',
            blogs: blogs,
            userId: req.user
        })
    })
    .catch(err => {
        console.log(err);
    })
}
exports.getBlogDetails = (req, res, next) => {
    const blogId = req.params.blogId;
    Blog.findById(blogId)
        .then(blog => {
            User.findById (blog.userId)
            .then(user => { 
                if(!user) {
                       res.render('blog/details', {
                        pageTitle: blog.title,
                        path: 'blog/details',
                        blog: blog,
                        userName: 'Deleted User',
                        userId: req.user,
                        Random: false
                    })
                }
                    res.render('blog/details', {
                    pageTitle: blog.title,
                    path: 'blog/details',
                    blog: blog,
                    userName: user.userName,
                    userId: req.user,
                    user: user,
                    Random: true
            })
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postDeleteBlog = (req, res, blog) => {
    const blogId = req.params.blogId;
    Blog.findByIdAndRemove(blogId)
        .then(result => {
            console.log('Blog deleted');
            res.redirect('/blog/all');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getEditBlog = (req, res, blog) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const blogId = req.params.blogId;
    Blog.findById(blogId)
        .then(blog => {
            if(!blog) {
                return res.redirect('/blog/all');
            }
            res.render('blog/addBlog', {
                pageTitle: 'edit Blog',
                path: '/blog/editBlog',
                editing: editMode,
                blog: blog,
                userId: req.user,
                hasError: false,
                errorMessage: null,
                validationErrors: [],
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postEditBlog = (req, res, next) => {
    const blogId = req.params.blogId;
    const updatedTitle = req.body.title;
    const updatedDesc = req.body.description;
    const updatedContent = req.body.content;
    const UpdatedCategory = req.body.category;
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(422).render('blog/addBlog', {
          pageTitle: 'edit Blog',
          path: '/blog/editBlog',
          editing: true,
          hasError: true,
          blog: {
            title: updatedTitle,
            description: updatedDesc,
            content: updatedContent,
            category: UpdatedCategory,
            _id: blogId
          },
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array(),
          userId: req.user
        });
      }

    Blog.findById(blogId)
    .then(blog => {
      blog.title = updatedTitle;
      blog.description = updatedDesc;
      blog.content = updatedContent;
      blog.category = UpdatedCategory;
      return blog.save();
    })
        .then(result => {
            console.log('Blog updated!');
            res.redirect('/blog/all');
        })
        .catch(err => {
            console.log(err);
        })
}