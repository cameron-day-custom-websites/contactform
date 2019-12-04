/*
*    MIT License
*
*   Copyright (c) 2019 Jacob Gasser
*   Modified work Copyright 2019 Cameron Day Custom Websites
*
*    Permission is hereby granted, free of charge, to any person obtaining a copy
*    of this software and associated documentation files (the "Software"), to deal
*    in the Software without restriction, including without limitation the rights
*    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*    copies of the Software, and to permit persons to whom the Software is
*    furnished to do so, subject to the following conditions:

*    The above copyright notice and this permission notice shall be included in all
*    copies or substantial portions of the Software.

*   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
*    SOFTWARE.
*/

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
