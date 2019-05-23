var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var sessionStore = require('express-mysql-session')(session);
var sequelize = require('./util/database')
var csurf = require('csurf');
var multer  = require('multer');
var flash = require('connect-flash');
var userModel = require('./models/user');
var productModel = require('./models/productModel');
var categoryModel = require('./models/categoryModel');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var authRouter = require('./routes/auth');

var app = express();
const csrfProtection = csurf();


const store = new sessionStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: null,
  database: 'admin'
});
const fileStorage = multer.diskStorage({
  destination: (req,file,cb)=>{
      cb(null ,'images/');
  },
  filename:(req,file,cb)=>{
      cb(null, Math.random().toString(36).substr(2, 9) + '-' + file.originalname );
  }
})
const fileFilter = (req, file , cb)=>{
if ( file.mimetype === 'image/png' ||
     file.mimetype === 'image/jpg' ||
     file.mimetype === 'image/jpeg'){
      cb(null,true);
  }else {
      cb(null,false);

  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'mysecretlong', resave: false, saveUninitialized: false, store: store}))
app.use(flash());
app.use(multer({ storage: fileStorage , fileFilter: fileFilter}).single('file'));
app.use(csrfProtection);

app.use(function (req, res, next){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Method','GET,POST');
 res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-with,Content-Type,Accept');
res.locals.isAuthenticated = req.session.isLoggedIn;
res.locals.csrfToken = req.csrfToken();
next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images' ,express.static(path.join(__dirname, 'images')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

//associations
productModel.belongsTo(userModel,{constraints:true, onDelete:'CASCADE',});
productModel.belongsTo(categoryModel,{constraints:true, onDelete:'CASCADE'});
userModel.hasMany(productModel);
categoryModel.hasMany(productModel);

// initialize database Sync
sequelize.sync({forceStart :true}).then( res => {

})
.catch(err => {
  console.log(err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
