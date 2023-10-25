const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "sumitsaini4000@gmail.com",
        pass: "wcfphwlljisqahos"
    }
});
function sendMail(email, subject, text) {

    const mailConfigurations = {
        // It should be a string of sender/server email
        from: 'Sumit Saini',
        to: email,
        // Subject of Email
        subject: subject,
        // This would be the text of email body
        text: text

    };
    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        };
        console.log('Email Sent Successfully');
    });
    return true;
}
module.exports={
    sendMail
}