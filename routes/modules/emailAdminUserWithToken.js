var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

var emailAdminUserWithToken = function(req, res, flag) {
    var path1, path2;
    if (flag == 'admin') {
        path1 = '/admin/forgotpass/';
        path2 = '/admin/monitor';
    } else {
        path1 = '/user/forgotpass/';
        path2 = '/user/profile';
    }
    return function(admin, callback) {
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "login", // default
                admin: '?',
                pass: '?'
            } 
        });
        var mailOptions = {
            to: admin.email,
            from: '?',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + admin.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            if (err) {
                req.flash('error', 'No email sent.');
                return res.redirect(path1 + req.params.token);
            }
            req.flash('success', 'Success! Your password has been changed.');
            res.redirect(path2);
//                callback(err);
        });
    }
}

module.exports = {emailAdminUserWithToken};

//Sample code:
//var email_smtp = nodemailer.createTransport({      
//  host: "smtp.gmail.com",
//  auth: {
//    type: "OAuth2",
//    user: "youremail@gmail.com",
//    clientId: "CLIENT_ID_HERE",
//    clientSecret: "CLIENT_SECRET_HERE",
//    refreshToken: "REFRESH_TOKEN_HERE"                              
//  }
//});
//And if you still want to use just plain text password, disable secure login on your google account and use as follows:
//
//var email_smtp = nodemailer.createTransport({      
//  host: "smtp.gmail.com",
//  auth: {
//    type: "login", // default
//    user: "youremail@gmail.com",
//    pass: "PASSWORD_HERE"
//  }
//});