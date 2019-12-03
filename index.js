const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const nodemailer = require('nodemailer')
const app = express()
admin.initializeApp();
const db = admin.firestore()

const _template =
    "<h1>You have received a contact form</h1>\r\n" +
    "<h3 style='font-style: italic;'>From: $AUTHOR; On: $DATE</h6>\r\n" +
    "<span>$MESSAGE</span>"


app.use(express.urlencoded())

app.use(express.json())

app.post('/send', async (req, res) => {

    await db.collection('messages').doc().set(req.body)

    await send(req.body.message, req.body.author, req.body.date, req.body.to)

    res.send("sent")
})


exports.contact = functions.https.onRequest(app)

async function send(message, author, date, to) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'day@camerondaycustomwebsites.net',
            pass: 'cams super secret password'
        }
    });

    var mailOptions = {
        from: 'day@camerondaycustomwebsites.net',
        to: to,
        subject: 'Contact Form Received',
        html: construct(message, author, date)
    };

    transporter.sendMail(mailOptions);

}


function construct(message, author, date) {
    let template = _template

    template = template.replace('$MESSAGE', message)
    template = template.replace('$AUTHOR', author)
    template = template.replace('$DATE', date)

    return template
}