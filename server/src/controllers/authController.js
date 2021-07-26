const util = require('util');
const md5 = require('md5');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { saveUser, findUserByEmail, findUserById, setUserStatusVerifiedById } = require('../helperFunctions/googleSheets');

const postRegisterForm = async(req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const {
        name = null,
            mailFrom = null,
            password = null,
            password2 = null,
    } = req.body;

    const { refId = null } = req.query;

    if (!name || !mailFrom || !password || !password2) {
        return res.status(500).json({ message: 'Not all data for registration is present' })
    } else {
        if (password !== password2) {
            return res.status(401).json({ message: 'Passwords don`t match' })
        }

        const id = uuidv4();

        try {
            
            const secret = speakeasy.generateSecret();

            const userData = {
                id,
                name,
                mailFrom,
                // mailTo,
                password: md5(password),
                secret: secret.base32,
                otpauthURL: secret.otpauth_url,
                verified: false
            }

            if (refId) {
                userData.referalId = refId;
            }

            await saveUser(userData);

            return res.status(200).json({ message: 'ok', id })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: 'Error generating the secret' })
        }
    }
}

const postLoginForm = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            res.status(401).json({ message: 'Wrong authorization data' });
        } else {
            if (user.password === md5(password)) {
                res.status(200).json({ message: 'Authorized', id: user.id });
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

const get2FA = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
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
const post2FAForm = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const { token, userId: id } = req.body;

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