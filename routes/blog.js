const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const isAuth = require('../middleware/is-auth');
const userVerification = require('../middleware/userAndBlogUser');
const { body } = require('express-validator/check');
const Blog = require('../models/blog');


router.get('/addBlog',isAuth, blogController.getAddBlog);

router.post('/addBlog', [
    body('title', 'Title should of minimum 3 alphabets')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('description', 'Description should of minimum 3 and maximum 50 alphabets')
        .isLength({ min: 4, max: 50 })
        .trim(),
    body('content', 'Content should of minimum 20 and maximum 2000 alphabets')
      .isLength({ min: 20, max: 2000 })
      ,
    body('category', 'Content should of minimum 3 and maximum 15 alphabets')
        .isLength({ min: 3, max: 15 })
  ],isAuth, blogController.postAddBlog);

router.get('/all', blogController.getAll);

router.get('/:blogId', blogController.getBlogDetails);

router.post('/:blogId/delete-blog',isAuth, blogController.postDeleteBlog);

router.get('/:blogId/edit-blog',isAuth,userVerification ,blogController.getEditBlog);

router.post('/:blogId/editBlog', [
    body('title', 'Title should of minimum 3 alphabets')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('description', 'Description should of minimum 3 and maximum 50 alphabets')
        .isLength({ min: 4, max: 50 })
        .trim(),
    body('content', 'Content should of minimum 20 and maximum 2000 alphabets')
      .isLength({ min: 20, max: 2000 }),
    body('category', 'Content should of minimum 3 and maximum 15 alphabets')
        .isLength({ min: 3, max: 15 })
  ],isAuth, blogController.postEditBlog);


module.exports = router;