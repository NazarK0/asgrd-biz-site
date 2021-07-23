const util = require('util');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const postRegisterForm = async (req, res) => {
  const { 
    name =null,
    mailFrom=null,
    mailTo=null,
    password=null,
  } = req.body;

  if (!name || !mailFrom || !mailTo || !password ) {
    return res.status(500).json({ message: 'Not all data for registration is present'})
  } else {
    const id = uuidv4();

    try {
      const secret = speakeasy.generateSecret();

      const userData = {
        id,
        name,
        mailFrom,
        mailTo,
        password,
        secret: secret.base32,
        otpauthURL: secret.otpauth_url,
        verified: false
      }

      // await User.create(userData);

      return res.status(200).json(userData);
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error generating the secret'})
    }
  }
}

const postLoginForm = async (req, res) => {
  const { email, password } = req.body;

  //find user in google sheet
  const user = true;

  if (!user) {
    res.status(401).json({ message: 'Wrong authorization data'});
  } else {
    res.status(200).json({ message: 'Authorized'});
  }

  

};

const get2FA = async (req, res) => {
  const { id } = req.params;
  // find user
  const user = true;
  if (!user) {
    res.status(401).json({ message: 'Fake user'});
  }

  const { verified, secret, otpauthURL } = user;

  if (!verified) {
    const QRtoDataURL = util.promisify(QRCode.toDataURL);
    const verifyQR = await QRtoDataURL(otpauthURL)
    res.status(200).json({ verified, secret, verifyQR, id });
  } else {
    res.status(200).json({ verified, id });
  }
  
}
const post2FAForm = async (req, res) => {
  const { token, id } = req.body;

  try {
    // find user in google sheets

    const secret = user.secret;

    const verified = speakeasy.totp.verify({ 
      secret,
      encoding: 'base32',
      token 
    });

    if (verified) {
      // await User.update({ verified: true }, {
      //   where: {
      //     id: userId
      //   }
      // });
      res.status(200).json({ verified: true })
    } else {
      res.status(401).json({ verified: false })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error finding user'})
  }
}

module.exports = {
  postRegisterForm,
  postLoginForm,
  get2FA,
  post2FAForm,
}