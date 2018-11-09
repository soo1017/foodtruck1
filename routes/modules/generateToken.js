var crypto = require('crypto');

var generateToken = function() {
    return function(callback) {
        crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            callback(err, token);
        });
    }
}

module.exports = {generateToken};