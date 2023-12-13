const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC || process.config.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE || process.config.MJ_APIKEY_PRIVATE
});

function sendMail(email, name, subject, text) {
    return new Promise((resolve, reject) => {
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "01sumitsaini@gmail.com",
                            Name: "E-commerce"
                        },
                        To: [
                            {
                                Email: email,
                                Name: name
                            }
                        ],
                        Subject: subject,
                        // TextPart: text,
                        HTMLPart: text
                    }
                ]
            });
        request.then((result) => {
            // console.log(result.body);
            resolve(result)
        }).catch((err) => {
            console.log(err.statusCode);
            reject(false);
        })
    })
}
module.exports = {
    sendMail
}