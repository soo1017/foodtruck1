const MailComposer = require('nodemailer/lib/mail-composer');
const _ = require('lodash');

var sendEmail = function(req, res){
    var contact;
    contact = _.pick(req.body, ['email', 'name', 'message']);
    
    contact.from_email = "ilsoo66@gmail.com";
    contact.to_email = "ilsoo66@gmail.com";

    var subject = "UpTaste: Customer Contact - ";
        subject = subject.concat(contact.contact_name);
        subject = subject.concat(" - ");
        subject = subject.concat(contact.contact_email);
    var text_Message = contact.contact_inputtext;

    var ses_mail = new MailComposer({
        from: contact.from_email, to: contact.to_email, subject: subject, text: text_Message
    });

    return new Promise((resolve, reject) => {
        ses_mail.compile().build(function(err, res) {
            err ? reject(err) : resolve(res);    // res will be Email message
        });
    });
}

module.exports = {sendEmail};
