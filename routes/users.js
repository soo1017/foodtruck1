var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

var {Product} = require('./models/product');
var {User} = require('./models/user');
var {makeChunk} = require('./modules/makeChunk');
var {Order} = require('./models/order');
var Cart = require('./models/cart');
var {generateToken} = require('./modules/generateToken');
var {findAdminUser} = require('./modules/findAdminUser');
var {emailAdminUser} = require('./modules/emailAdminUser');
var {findAdminUserWithToken} = require('./modules/findAdminUserWithToken');
var {emailAdminUserWithToken} = require('./modules/emailAdminUserWithToken');

var app = express();

var csrfProtection = csrf();
router.use(csrfProtection);  

app.use(function (req, res, next) {
  var token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();
});

/* GET Profile page. */
router.get('/profile', isLoggedIn, function(req, res, next) {       // before notLoggedIn Middleware
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { title: 'UpTaste', orders: orders, carouseDisabled: "yes", footerDisabled: 'yes' });
    });
});

/* GET Log Out page. */
router.get('/logout', isLoggedIn, function(req, res, next) {
    if (req.user.isAdmin == false) {
        req.logout();
        res.redirect('/');
    }
})

/* MiddleWare - page without login. */
// ////////////////
router.use('/', notLoggedIn, function(req, res, next) {
    next();
})

/* GET Sign UP page. */
router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, carouseDisabled: "yes", footerDisabled: 'yes'});
});

/* POST Sign UP page. */
router.post('/signup', passport.authenticate('local.signup', {
//    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}), function(req, res, next){                   // run only when success
    if (req.session.oldUrl) {                   // the case from checkout case
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {                                    // general browsing
        res.redirect('/user/profile')
    }
});

/* GET Sign IN page. */
router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, carouseDisabled: "yes", footerDisabled: 'yes'});
})

/* POST Sign IN page. */
router.post('/signin', printReq, passport.authenticate('local.signin', {
//    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next){                   // run only when success
    if (req.session.oldUrl) {                   // the case from checkout case
        var oldUrl = req.session.oldUrl;
        console.log("olfUrl: ", oldUrl);
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {                                    // general browsing
        res.redirect('/user/profile')
    }
});

/* GET Reset Password page. */
router.get('/resetpassword', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/resetpassword', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, carouseDisabled: "yes", footerDisabled: 'yes'});
});

/* POST Reset Password page. */
router.post('/resetpassword', passport.authenticate('local.resetpassword', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/resetpassword',
    failureFlash: true
}));

/* GET Forgot Password page. */
router.get('/forgot', function(req, res, next) {
    var messages = req.flash('error');
    var infomessages = req.flash('info');
    res.render('user/forgot', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, infomessages: infomessages, hasInfos: infomessages.length > 0, carouseDisabled: "yes", footerDisabled: 'yes'});
});

/* POST Forgot Password page. */
router.post('/forgot', function(req, res, next) {
    async.waterfall([
        generateToken(),
        findAdminUser(req, 'user'),
        emailAdminUser(req, res, 'user')
    ], function(err) {
        if (err) return next(err);
        res.redirect('/user/forgot');
//        return done(null, user);
    });
});

/* GET Reset Forgot Password page. */
router.get('/forgotpass/:token', function(req, res, next) {
    var messages = req.flash('error');
    var infomessages = req.flash('info');

    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (err) {
            return res.redirect('/user/forgot');
        }
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/user/forgot');
        }
        res.render('user/forgotpass', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, infomessages: infomessages, hasInfos: infomessages.length > 0, paramtoken: req.params.token, carouseDisabled: "yes", footerDisabled: 'yes' });
    })
});

/* POST Reset Forgot Password page. */
router.post('/forgotpass/:token', function(req, res, next) {
    async.waterfall([
        findAdminUserWithToken(req, 'user'),
        emailAdminUserWithToken(req, res, 'user')
    ], function(err) {
        res.redirect('/user/forgotpass/' + req.params.token);
    });
});



module.exports = router;


/// Middlewares
///////////////////////////////////////////
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function printReq(req, res, next) {
    console.log("req: ", req);
    next();
}

