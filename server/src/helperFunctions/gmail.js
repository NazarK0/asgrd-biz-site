const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const {authenticate} = require('@google-cloud/local-auth');
const OAuth2 = google.auth.OAuth2;
const settings = require('../../../gmailSettings.json');

const gmail = google.gmail('v1');


  // Obtain user credentials to use for the request
  

  

const sendEmail = async (name, recepient) => {
  const client = new OAuth2(settings.clientId, settings.clientSecret, settings.redirectURL);
  client.setCredentials({ refresh_token: settings.refreshToken });

  const getHTML_Message = (name) => (`
  <h3>${name}, Здравствуйте!</h3>
  <p>
    Текст сообщения
  </p>
  `);
  const response = await client.getAccessToken();

  if (response.res.status !== 200) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: settings.user,
      clientId: settings.clientId,
      clientSecret: settings.clientSecret,
      refreshToken: settings.refreshToken,
      accessToken: response.token,
    }
  });
  
  const mailOptions = {
    from: `ASGARD<${settings.user}>`,
    to: recepient,
    subject: 'Автоматическое сообщение',
    text: getHTML_Message(name),
  }
  
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err)
    } else {
      console.log(info.response)
    }
  })
}
  
const sendEmail2 = async () => {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, '../../../gmailSettings2.json'),
    scopes: [
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.send',
    ],
  });
  google.options({ auth });
  
  const subject = '🤘 Hello 🤘';
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    'From: Nazar Vanivskyi <staticman999@google.com>',
    'To: Nazar Vanivskyi <staticman999@google.com>',
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    'This is a message just to say hello.',
    'So... <b>Hello!</b>  🤘❤️😎',
  ];
  const message = messageParts.join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(res.data);
}

module.exports = {
  sendEmail,
  sendEmail2,
}
