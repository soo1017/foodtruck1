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

// Need to use GMAIL clientId, clientSecret, refreshToken
