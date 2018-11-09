var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
//var multer  = require('multer')
//var upload = multer({ dest: '${os.tmpdir()}/uploads' })
var fs = require('fs');
var formidable = require('formidable');

var {User} = require('./models/user');
var {Order} = require('./models/order');
var {FTLocation} = require('./models/ftlocation');
var {Product} = require('./models/product');
var Cart = require('./models/cart');
var {wordMonth} = require('./modules/wordMonth');
var {generateToken} = require('./modules/generateToken');
var {findAdminUser} = require('./modules/findAdminUser');
var {emailAdminUser} = require('./modules/emailAdminUser');
var {findAdminUserWithToken} = require('./modules/findAdminUserWithToken');
var {emailAdminUserWithToken} = require('./modules/emailAdminUserWithToken');
var {updateTodayOrders} = require('./modules/updateTodayOrders');

var app = express();

var csrfProtection = csrf();
router.use(csrfProtection); 

app.use(function (req, res, next) {
    var token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token);
    res.locals.csrfToken = token;
//    res.locals.messages = req.flash('success');
//    res.locals.errors = req.flash('error');
    next();
});

/* GET Monitor page. */
router.get('/monitor', isAdminLoggedIn, function(req, res, next) {       // before notLoggedIn Middleware
    updateTodayOrders(res, "monitor");
});
/* GET Monitor page. */
router.get('/monitor/order-update', isAdminLoggedIn, function(req, res, next) {       // before notLoggedIn Middleware
    updateTodayOrders(res, "monitor-update");
});

/* GET contentmanage page. */
router.get('/contentmanage', isAdminLoggedIn, function(req, res, next) {       // before notLoggedIn Middleware
    res.render('admin/contentmanage', { title: 'UpTaste', csrfToken: req.csrfToken(), carouseDisabled: "yes", footerDisabled: 'yes', adminHeader: "yes" });
});

/* GET contentmanage modify Food Truck location page. */
router.post('/contentmanage/modify-ftlocation', isAdminLoggedIn, function(req, res, next) {         // before notLoggedIn Middleware
    var day = req.body.day;
    var address = req.body.address;
    FTLocation.findOneAndUpdate({day: day}, {$set:{day: day, location: address }}, {new: true}, function(err, location) {
        if (err) {
            return res.redirect('/admin/contentmanage');
        }
        if (!location) {
            return res.redirect('/admin/contentmanage');
        }
        res.redirect('/admin/contentmanage');
    });
});

/* GET contentmanage delete Food page. */
router.post('/contentmanage/delete-food', isAdminLoggedIn, function(req, res, next) {         // before notLoggedIn Middleware
    var name = req.body.name;
    Product.findOneAndDelete({name: name}, function(err, product) {
        console.log("product: ", product);
        if (err) {
            return res.redirect('/admin/contentmanage');
        }
        if (!product) {
            return res.redirect('/admin/contentmanage');
        }
        res.redirect('/admin/contentmanage');
    });
});

/* GET contentmanage add Food page. */
router.post('/contentmanage/add-food', isAdminLoggedIn, function(req, res, next) {  
//router.post('/contentmanage/add-food', isAdminLoggedIn, upload.single(''), function(req, res, next) {  
    
    var tempproduct = {};
    var form = new formidable.IncomingForm();
    
    form.parse(req).on('field', function(name, value) {
        if (name == 'name') {
            tempproduct.name = value;
        } else if (name == 'price') {
            tempproduct.price = value;
        } else if (name == 'description') {
            tempproduct.description = value;
        } else {
            if (value == 'SU') {
                tempproduct.category = "sushi";
            } else if (value == 'NO') {
                tempproduct.category = "noodle";
            } else {
                tempproduct.category = "drink";
            }
        }
    }).on('fileBegin', function(name, file) {
        file.path = __dirname + '/../public/images/products/' + file.name;
        var imageroute = '/images/products/' + file.name;
        tempproduct.image = imageroute;
    }).on('file', function(name, file) {
        console.log('Uploaded ' + file.name);
    }).on('error', function(err) {
        console.log(err);
    }).on('end', function() {
        console.log("tempproduct: ", tempproduct);
        var product = new Product(tempproduct);
        product.save(function(err, result) {
            if (err) {
                return res.send(err);
            }
            res.redirect('/admin/contentmanage');
        });
    });
});

/* GET Complete Order. */
router.get('/complete-order/:id', isAdminLoggedIn, function(req, res, next) {
    var orderId = req.params.id;
    var completedTime = new Date().getTime();
    
    Order.findOneAndUpdate({_id: orderId}, {$set:{completedOrder: true, completedAt: completedTime }}, {new: true}, function(err, order) {
        if (err) {
            return res.redirect('/admin/monitor');
        }
        res.redirect('/admin/monitor');
    });
});

router.get('/logout', isAdminLoggedIn, function(req, res, next) {
    if (req.user.isAdmin == true) {
        req.logout();
        res.redirect('/');
    }
})

// ////////////////
router.use('/', notAdminLoggedIn, function(req, res, next) {
    next();
})

/* GET Sign UP page. */
router.get('/signup', function(req, res, next) {
    console.log("admin singup");
    var messages = req.flash('error');
    res.render('admin/signup', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, carouseDisabled: "yes", footerDisabled: 'yes', adminHeader: "yes"});
});

/* POST Sign UP page. */
router.post('/signup', passport.authenticate('local.adminsignup', {
    failureRedirect: '/admin/signup',
    failureFlash: true
//}), function(req, res, next) {
}), function(req, res, next){                   // run only when success
    if (req.session.oldUrl) {                   // the case from checkout case
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {                                    // general browsing
        res.redirect('/admin/monitor')
    }
});

/* GET Sign IN page. */
router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('admin/signin', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, carouseDisabled: "yes", footerDisabled: 'yes', adminHeader: "yes"});
})

/* POST Sign IN page. */
router.post('/signin', passport.authenticate('local.adminsignin', {
//    successRedirect: '/admin/profile',
    failureRedirect: '/admin/signin',
    failureFlash: true
}), function(req, res, next){                   // run only when success
    if (req.session.oldUrl) {                   // the case from checkout case
        var oldUrl = req.session.oldUrl;
        console.log("olfUrl: ", oldUrl);
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {                                    // general browsing
        res.redirect('/admin/monitor')
    }
});

/* GET Forgot Password page. */
router.get('/forgot', function(req, res, next) {
    var messages = req.flash('error');
    var infomessages = req.flash('info');
    res.render('admin/forgot', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, infomessages: infomessages, hasInfos: infomessages.length > 0, carouseDisabled: "yes", footerDisabled: 'yes', adminHeader: "yes"});
});

/* POST Forgot Password page. */
router.post('/forgot', function(req, res, next) {
    var token;
    async.waterfall([
        generateToken(),
        findAdminUser(req, 'admin'),
        emailAdminUser(req, res, 'admin')
    ], function(err) {
        if (err) return next(err);
        res.redirect('/admin/forgot');
//        return done(null, admin);
    });
});

/* GET Reset Forgot Password page. */
router.get('/forgotpass/:token', function(req, res, next) {
    var messages = req.flash('error');
    var infomessages = req.flash('info');
//    console.log("req.params: ", req.params);
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }, isAdmin: true }, function(err, admin) {
        if (err) {
            return res.redirect('/admin/forgot');
        }
        if (!admin) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/admin/forgot');
        }
        res.render('admin/forgotpass', {title: 'UpTaste', csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0, infomessages: infomessages, hasInfos: infomessages.length > 0, paramtoken: req.params.token, carouseDisabled: "yes", footerDisabled: 'yes', adminHeader: "yes" });
    })
});

/* POST Reset Forgot Password page. */
router.post('/forgotpass/:token', function(req, res, next) {
    async.waterfall([
        findAdminUserWithToken(req, 'admin'),
        emailAdminUserWithToken(req, res, 'admin')
    ], function(err) {
        res.redirect('/admin/forgotpass/' + req.params.token);
    });
});


           
module.exports = router;


/// Middlewares
function isAdminLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == true) {
        return next();
    }
    res.redirect('/');
}

function notAdminLoggedIn(req, res, next) {
    if (!(req.isAuthenticated() && req.user.isAdmin == true)) {
        return next();
    }
    res.redirect('/');
}

function printReq(req, res, next) {
    console.log("req.body: ", req.body);
    next();
}

/////////////////////
//function(done) {
//    crypto.randomBytes(20, function(err, buf) {
//        var token = buf.toString('hex');
//        done(err, token);
//    });  
//}
//function(token, done) {
//            User.findOne({email: req.body.email, isAdmin: true}, function(err, admin) {
//                if (!admin) {
//                    req.flash('error', 'No account with that email exists.');
//                    return res.redirect('/admin/forgot');
//                }
//                
//                admin.resetPasswordToken = token;
//                admin.resetPasswordExpires = Date.now() + 600000;        // 10 mins
//                
//                admin.save(function(err) {
//                    done(err, token, admin);
//                });
//            });
//        },
//        function(token, admin, done) {
//            var smtpTransport = nodemailer.createTransport({
//                service: 'gmail',
//                auth: {
//                    type: "login", // default
//                    admin: 'ilsoo66@gmail.com',
//                    pass: 'Mldaniel224$%'
//                } 
//            });
//            var mailOptions = {
//                to: admin.email,
//                from: 'ilsoo66@gmail.com',
//                subject: 'Password Reset',
//                text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
//                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//                    'http://' + req.headers.host + '/admin/forgotpass/' + token + '\n\n' +
//                    'If you did not request this, please ignore this email and your password will remian unchanged.\n'
//            };
//            smtpTransport.sendMail(mailOptions, function(err) {
//                if (err) {
//                    req.flash('error', 'No email sent.');
//                    return res.redirect('/admin/forgot');
//                }
//                req.flash('info', 'An email has ben sent to ' + admin.email + ' with further instructions.\n');
//                res.redirect('/admin/monitor');
////                done(err, 'done');
//            });
//        }

//////////////////////
//function(done) {
//            User.findOne({ resetPasswordToken: req.params.token, isAdmin: true }, function(err, admin) {
////            admin.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, admin) {
//                if (!admin) {
//                    req.flash('error', 'Password reset token is invalid or has expired.');
//                    return res.redirect('/admin/forgotpass/' + req.params.token);
//                }
//
//                admin.password = admin.encryptPassword(req.body.password);
//                admin.isAdmin = true;
//                admin.resetPasswordToken = undefined;
//                admin.resetPasswordExpires = undefined;
//
//                admin.save(function(err) {
//                    req.logIn(admin, function(err) {
//                        done(err, admin);
//                    });
//                });
//            });
//        },
//        function(admin, done) {
//            var smtpTransport = nodemailer.createTransport({
//                service: 'gmail',
//                auth: {
//                    type: "login", // default
//                    admin: 'ilsoo66@gmail.com',
//                    pass: 'Mldaniel224$%'
//                } 
//            });
//            var mailOptions = {
//                to: admin.email,
//                from: 'ilsoo66@gmail.com',
//                subject: 'Your password has been changed',
//                text: 'Hello,\n\n' +
//                    'This is a confirmation that the password for your account ' + admin.email + ' has just been changed.\n'
//            };
//            smtpTransport.sendMail(mailOptions, function(err) {
//                if (err) {
//                    req.flash('error', 'No email sent.');
//                    return res.redirect('/admin/forgotpass/' + req.params.token);
//                }
//                req.flash('success', 'Success! Your password has been changed.');
//                res.redirect('/admin/monitor');
////                done(err);
//            });
//        }

///////////////////////////////////////////////////////// Future Reference
//router.use(function (req, res, next) {
//  console.dir("req.body: ", req.body);
//  next()
//})

//Beware, you need to match .single() with whatever name="" of your file upload field in html
// Multer should be placed before CSRF token middleware
//app.use(multer({
//    dest: '${os.tmpdir()}/uploads',
//    rename: function (fieldname, filename) {
//        return filename;
//    },
//
//    onFileUploadData: function (file, data, req, res) {
//        console.log(data.length + ' of ' + file.fieldname + ' arrived...')
//    },
//    onFileUploadComplete: function (file, req, res) {
//        console.log(file.fieldname + ' uploaded to  ' + file.path)
//        done = true;
//    }
//}).single('foodimage')); 

//app.use(formidableMiddleware({
////    encoding: 'utf-8',
//    uploadDir: '/${os.tmpdir()}/uploads',
//    multiples: false
//}));
//    console.log("req.fields: ", req.fields);
//    console.log("req.fbody: ", req.body);
//    form.onPart = function(part) {
//        console.log("part: ", part);
//        if (!part.filename) {
//            console.log("repeat - if");
//            return form.handlePart(part)
//        };
//        count++;
//
//        // Ignore any more files.
//        if (count > maxAllowed) {
//            console.log("repeat - max");
//            return part.resume();
//        }
//        form.handlePart(part);
//    };
//    form.parse(req);
////    console.log("fields: ", fields);
////    console.log("files: ", files);
//    
//    form.on('fileBegin', function (name, file){
//        console.log("file0: ", file);
//        file.path = __dirname + '/../public/images/' + file.name;
//    });
//
//    form.on('file', function (name, file){
//        console.log("file1: ", file);
//        console.log('Uploaded ' + file.name);
//    });
//    form.on('field', function (name, fields){
//        console.log("fields: ", fields);
//        console.log('Uploaded ' + fields.name);
//    });


//    form.parse(req, function(err, fields, files) {
//        // Process the files. If you don't need them, delete them.
//        // Note that you should still reap your temp directory on occasion.
//        console.log("in");
//        console.log("fields: ", fields);
//        console.log("files: ", files);
//
//        async.map(Object.keys(files), function(key, cb) {
//            console.log("cb: ", cb);
//            console.log("key: ", key);
//            fs.unlink(files[key].path, cb);
//        }, function(err) {
//            res.end();
//        });
//    });
    
    
//    var product = new Product({
//        name: req.body.name,
//        price: req.body.price,
//        description: req.body.description,
////        image: req.files.foodimage,
//        category: req.body.category
////        name: req.fields.food,
////        price: req.fields.price,
////        description: req.fields.description,
////        image: '/images/products/' + req.files.foodimage,
////        category: req.fields.category
//    });
//    product.save(function(err, result) {
//        if (err) {
//            return res.send(err);
//        }
//        res.redirect('/admin/contentmanage');
//    });
