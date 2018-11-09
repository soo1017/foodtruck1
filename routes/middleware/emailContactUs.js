const {sendEmail} = require('./sendEmail');
const aws = require('aws-sdk');

aws.config.loadFromPath('./config/config.json');
// Instantiate SES.
var ses = new aws.SES();

var emailContactUs = function(req, res, next) {
    
    sendContactEmail(req, res).then(message => {
        var sesParams = {
            RawMessage: {
                Data: message
            },
        };

        ses.sendRawEmail(sesParams, (err, data) => {
            if(err) {
                res.send(err);
                next();
            } else {
                res.send(data);
                next();
            }
        });
    }).catch((e) => {
        res.send(e);
    });
}

module.exports = {emailContactUs};
