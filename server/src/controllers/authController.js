const util = require('util');
const md5 = require('md5');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { saveUser, findUserByEmail, findUserById, setUserStatusVerifiedById } = require('../helperFunctions/googleSheets');

const postRegisterForm = async(req, res) => {
    const {
        name = null,
            mailFrom = null,
            mailTo = null,
            password = null,
    } = req.body;

    const { refId = null } = req.query;

    if (!name || !mailFrom || !mailTo || !password) {
        return res.status(500).json({ message: 'Not all data for registration is present' })
    } else {
        const id = uuidv4();

        try {
            const secret = speakeasy.generateSecret();

            const userData = {
                id,
                name,
                mailFrom,
                mailTo,
                password: md5(password),
                secret: secret.base32,
                otpauthURL: secret.otpauth_url,
                verified: false
            }

            if (refId) {
                userData.referalId = refId;
            }

            await saveUser(userData);

            return res.sendStatus(200);
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Error generating the secret' })
        }
    }
}

const postLoginForm = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            res.status(401).json({ message: 'Wrong authorization data' });
        } else {
            if (user.password === md5(password)) {
                res.status(200).json({ message: 'Authorized' });
            } else {
                res.status(401).json({ message: 'Wrong password' });
            }
        }
    } catch (error) {
        console.error(error);

        if (error instanceof FetchError) {
            res.sendStatus(504);
        } else {
            res.sendStatus(500);
        }
    }
};

const get2FA = async(req, res) => {
    const { id } = req.params;

    try {
        const user = await findUserById(id);

        if (!user) {
            res.status(401).json({ message: 'Fake user' });
        } else {
            const { verified, secret, otpauthURL } = user;

            if (verified === 'FALSE') {
                const QRtoDataURL = util.promisify(QRCode.toDataURL);
                const verifyQR = await QRtoDataURL(otpauthURL)
                res.status(200).json({ verified, secret, verifyQR, id });
            } else if (verified === 'TRUE') {
                res.status(200).json({ verified, id });
            } else {
                res.status(500).json({ message: 'Wrong input data' })
            }
        }
    } catch (error) {
        console.error(error);

        if (error instanceof FetchError) {
            res.sendStatus(504);
        } else {
            res.sendStatus(500);
        }
    }
}
const post2FAForm = async(req, res) => {
    const { token, id } = req.body;

    try {
        const user = await findUserById(id);

        if (!user) {
            res.status(401).json({ message: 'Fake user' });
        } else {
            const secret = user.secret;

            const verified = speakeasy.totp.verify({
                secret,
                encoding: 'base32',
                token
            });

            if (verified) {
                await setUserStatusVerifiedById(id);
                res.status(200).json({ verified: true })
            } else {
                res.status(401).json({ verified: false })
            }
        }
    } catch (error) {
        console.error(error);

        if (error instanceof FetchError) {
            res.sendStatus(504);
        } else {
            res.status(500);
        }
    }
}

module.exports = {
    postRegisterForm,
    postLoginForm,
    get2FA,
    post2FAForm,
}