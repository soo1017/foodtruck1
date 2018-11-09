var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var async = require('async');
var nodemailer = require('nodemailer');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminsRouter = require('./routes/admins');
var shopsRouter = require('./routes/shops');

var app = express();

mongoose.connect('mongodb://localhost:27017/uptaste', { useNewUrlParser: true });
require('./config/passport');               // automatically run

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());                       // before cookieParser, after bodyParser to validate body
app.use(cookieParser());                    
app.use(session({
    secret: 'myuptastesecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
})); // session should be after cookieParser
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {         // Middleware 
    res.locals.login = req.isAuthenticated();   // for view
    res.locals.session = req.session;
//    res.locals.csrfToken = token;
    next();
})
//app.use(function (req, res, next) {
//  var token = req.csrfToken();
//  res.cookie('XSRF-TOKEN', token);
//  res.locals.csrfToken = token;
//  next();
//});

app.use('/user', usersRouter);
app.use('/admin', adminsRouter);
app.use('/shop', shopsRouter);
app.use('/', indexRouter);


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
