var {User} = require('../models/user');

var findAdminUser = function(req, flag) {
    var path1, boolean1;
    if (flag == 'admin') {
        path1 = '/admin/forgot';
        boolean1 = true;
    } else {
        path1 = '/user/forgot';
        boolean1 = false;
    }
    return function(token, callback) {
        User.findOne({email: req.body.email, isAdmin: boolean1}, function(err, admin) {
            if (!admin) {
                req.flash('error', 'No account with that email exists.');
                return res.redirect(path1);
            }

            admin.resetPasswordToken = token;
            admin.resetPasswordExpires = Date.now() + 600000;        // 10 mins

            admin.save(function(err) {
                callback(err, token, admin);
            });
        });
    }
}

module.exports = {findAdminUser};
