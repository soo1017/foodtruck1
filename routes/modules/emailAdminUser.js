var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

var emailAdminUser = function(req, res, flag) {
    var path1, path2, path3;
    if (flag == 'admin') {
        path1 = '/admin/forgotpass/';
        path2 = '/admin/forgot';
        path3 = '/admin/monitor';
    } else {
        path1 = '/user/forgotpass/';
        path2 = '/user/forgot';
        path3 = '/user/profile';
    }
    return function(token, admin, callback) {
        var smtpTransport = nodemailer.createTransport({
            service: 'smtp.gmail.com',
            auth: {
                type: "login", // default
                admin: '?',
                pass: '?'
            } 
        });
        var mailOptions = {
            to: admin.email,
            from: '?',
            subject: 'Password Reset',
            text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + path1 + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remian unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            if (err) {
                console.log("err: ", err);
                req.flash('error', 'No email sent.');
                return res.redirect(path2);
            }
            req.flash('info', 'An email has ben sent to ' + admin.email + ' with further instructions.\n');
            res.redirect(path3);
//            callback(err, 'done');
        });
    }
}

module.exports = {emailAdminUser};

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

//                host: "smtp.gmail.com",
//                auth: {
//                    type: "OAuth2",
//                    user: "ilsoo66@gmail.com",
//                    clientId: "CLIENT_ID_HERE",
//                    clientSecret: "CLIENT_SECRET_HERE",
////                    refreshToken: "REFRESH_TOKEN_HERE"
//                    xoauth2: xoauth2.createXOAuth2Generator({
//                        user: 'ilsoo66@gmail.com',
//                        clientId: '920645017601-jbc9h23keadfnijjfh423hambqeen4kj.apps.googleusercontent.com',
//                        clientSecret: 'c7P72nNrs4r8LFJX4nZMyAcg',
//                        refreshToken: '-'
//                    })


