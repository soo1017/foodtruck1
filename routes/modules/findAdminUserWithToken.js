var {User} = require('../models/user');

var findAdminUserWithToken = function(req, flag) {
    var path1, boolean1;
    if (flag == 'admin') {
        path1 = '/admin/forgotpass/';
        boolean1 = true;
    } else {
        path1 = '/user/forgotpass/';
        boolean1 = false;
    }
    return function(callback) {
        User.findOne({ resetPasswordToken: req.params.token, isAdmin: boolean1 }, function(err, admin) {
            if (!admin) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect(path1 + req.params.token);
            }

            admin.password = admin.encryptPassword(req.body.password);
            admin.isAdmin = boolean1;
            admin.resetPasswordToken = undefined;
            admin.resetPasswordExpires = undefined;

            admin.save(function(err) {
                req.logIn(admin, function(err) {
                    callback(err, admin);
                });
            });
        });
    }
}

module.exports = {findAdminUserWithToken};
