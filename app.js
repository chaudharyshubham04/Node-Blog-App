const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const path = require('path');
const flash = require('connect-flash');
const MONGODB_URI =
  'mongodb+srv://Shubham:unplugged@cluster0-5efoz.mongodb.net/blogProject?retryWrites=true&w=majority';

const app = express();
const blogRoutes = require('./routes/blog');
const startRoutes = require('./routes/start');
const errorController = require('./controllers/error');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  app.set('view engine', 'ejs');
  app.set('views', 'views');

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('profilepic')
  );
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/images', express.static(path.join(__dirname, 'images')));

  app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  );
  
  app.use(flash());
  
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
  });
  app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        if (!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => {
        console.log(err);
      });
  });

app.use(startRoutes);
app.use('/blog', blogRoutes);
app.use(authRoutes);
app.use('/user',userRoutes);
app.use(errorController.get404);
//console.log('X');

mongoose
.connect(MONGODB_URI)
.then(result => {
  app.listen(3000);
})
.catch(err => {
  console.log(err);
});
 
