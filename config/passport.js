var passport = require('passport');
var {User} = require('../routes/models/user');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var crypto = require('crypto');

// determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}
passport.serializeUser(function(user, done) {       
    done(null, user.id);
});

// your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc). In deserializeUser that key is matched with the in memory array / database or any data resource.
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:8});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'Email is already in use.'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.isAdmin = false;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    })
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email, isAdmin: false}, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));

passport.use('local.resetpassword', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'oldpassword',
    passReqToCallback: true
}, function(req, email, oldpassword, done) {
    var newpassword = req.body.newpassword;
    var confirmnewpassword = req.body.confirmnewpassword;
    
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('oldpassword', 'Invalid password').notEmpty();
    req.checkBody('newpassword', 'New password missing').notEmpty();
    req.checkBody('confirmnewpassword', 'New passwords do not match').notEmpty().equals(req.body.newpassword);
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages));
    }
    
    User.findOne({'email': email, isAdmin: false }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found'});
        }
        user.set({ password: user.encryptPassword(newpassword)});
        user.save(function (errq, userq) {
            if (errq) {
                return done(err);
            }
            if (!userq) {
                return done(null, false, {message: 'No new password saved'});
            }
            return done(null, userq);
        })
    });
}));

passport.use('local.forgotpassword', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, function(req, email, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    var errors = req.validationErrors();
    console.log("errors: ", errors);
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages));
    }
    
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });  
        },
        function(token, done) {
            User.findOne({email: email, isAdmin: false }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email exists.');
                    return res.redirect('/user/forgot');
                }
                
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 600000;        // 10 mins
                
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'gmail',
                auth: {
                    user: '?',
                    pass: '?'
                } 
            });
            var mailOptions = {
                to: user.email,
                from: '?',
                subject: 'Password Reset',
                text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/user/forgotpass' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remian unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('info', 'An email has ben sent to ' + user.email + ' with further instructions.\n');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        return done(null, user);
//        res.redirect('/user/forgot');
    });
}));


///////////////////////////////  Admin
///////////////////////////////////////////////////////

passport.use('local.adminsignup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:8});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages));
    }
    User.find({isAdmin: true}, function(err0, count) {                   // Allow only two admins
        if (err0) {
            return done(err0);
        }
        if (count.length >= 2) {
            return done(null, false, {message: 'Only two admin allowed'});
        } 
        User.findOne({email: email, isAdmin: true}, function(err, admin) {
            if (err) {
                return done(err);
            }
            if (admin) {
                return done(null, false, {message: 'Email is already in use.'});
            }
            var newAdmin = new User();
            newAdmin.email = email;
            newAdmin.isAdmin = true;
            newAdmin.password = newAdmin.encryptPassword(password);
            newAdmin.save(function(err, result) {
                if (err) {
                    return done(err);
                }
                return done(null, newAdmin);
            });
        });
        
    });
}));

passport.use('local.adminsignin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        })
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({email: email, isAdmin: true}, function(err, admin) {
        if (err) {
            return done(err);
        }
        if (!admin) {
            return done(null, false, {message: 'No admin found.'});
        }
        if (!admin.validPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, admin);
    });
}));



