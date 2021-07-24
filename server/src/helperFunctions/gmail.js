const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const settings = require('../../../gmailSettings.json');

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

module.exports = {
  sendEmail,
}
