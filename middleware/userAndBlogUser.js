
const Blog = require('../models/blog');
module.exports = (req, res, next) => {
   // console.log(req.params.blogId)
    Blog.findById(req.params.blogId, (err,blog)=>{
        console.log(blog);
        if(req.user._id.equals(blog.userId)){
            next();
        }else{
            res.redirect('/blog/all');
        }
    })
    
    


}