const path = require('path');
const { google } = require('googleapis');

const SPREADSHEET_ID = '1yeZ7tozJHKGjRJtCAISlDyeRY28sPWt5_AnsBO7CEno';
const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

const ID_INDEX = 10;
const LOGIN_INDEX = 3;
const PASSWORD_INDEX = 5;
const VERIFIED_STATUS_INDEX = 1;
const SECRET_INDEX = 7;
const QR_INDEX = 8;

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../..', 'credentials.json'),
  scopes,
});

const getUsers = async () => {
  const client = await auth.getClient()
  const googleSheets = google.sheets({ version: 'v4', auth: client })
  const metadata = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId: SPREADSHEET_ID,
  })

  const mainSheetName = metadata.data.sheets[0].properties.title

  const response = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: SPREADSHEET_ID,
    range: mainSheetName,
  })

  const users = response.data.values;

  // console.dir(users)

  return users;
};

const saveUser = async (userData) => {
  const {
    id,
    name,
    mailFrom,
    mailTo,
    password,
    secret,
    otpauthURL,
    verified,
    referalId = null,
  } = userData;

  const client = await auth.getClient()
  const googleSheets = google.sheets({ version: 'v4', auth: client })
  const metadata = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId: SPREADSHEET_ID,
  })

  const mainSheetName = metadata.data.sheets[0].properties.title

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId: SPREADSHEET_ID,
    range: `${mainSheetName}!A:M`,
    valueInputOption: 'RAW',
    resource: {
      values: [
        [
          '',
          verified,
          name,
          mailFrom,
          mailTo,
          password,
          'phoneNumber',
          secret,
          otpauthURL,
          new Date().toLocaleDateString('uk'),
          id,
          referalId || '',
          '',
        ],
      ],
    },
  })

};

/**
 * Find user in google spreadsheet
 * @function findUser
 * @param {string} id - email for finding user.
 */
const findUserById = async (id) => {
  const users = await getUsers();

  const user = users.filter(user => user[ID_INDEX] === id);

  if (user.length == 0) {
    return null;
  } else if (user.length == 1) {
    return {
      id:         user[0][ID_INDEX],
      login:      user[0][LOGIN_INDEX],
      password:   user[0][PASSWORD_INDEX],
      verified:   user[0][VERIFIED_STATUS_INDEX],
      secret:     user[0][SECRET_INDEX],
      otpauthURL: user[0][QR_INDEX],
    };
  } else {
    console.error(`Too many users with id ${id}`)
    return null;
  }
};
const setUserStatusVerifiedById = async (id) => {
  const user = await findUserById(id);

  if (user) {
    const client = await auth.getClient()
    const googleSheets = google.sheets({ version: 'v4', auth: client })
    const metadata = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId: SPREADSHEET_ID,
    })

    const mainSheetName = metadata.data.sheets[0].properties.title;

    const usersList = await getUsers();
    const rowIdx = usersList.findIndex((user) => user[ID_INDEX] === id && user[VERIFIED_STATUS_INDEX] === 'FALSE');

    if (rowIdx > -1) {
      await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId: SPREADSHEET_ID,
        range: `${mainSheetName}!B${rowIdx + 1}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['TRUE']]
        }
      });
    }
  } else {
    throw new Error('Error set verification state. No such user');
  }
};
/**
 * Find user in google spreadsheet
 * @function findUser
 * @param {string} email - email for finding user.
 */
const findUserByEmail = async (email) => {
  const users = await getUsers();

  const user = users.filter(user => user[LOGIN_INDEX] === email);

  if (user.length == 0) {
    return null;
  } else if (user.length == 1) {
    return {
      id: user[0][ID_INDEX],
      login: user[0][LOGIN_INDEX],
      password: user[0][PASSWORD_INDEX],
    };
  } else {
    console.error(`Too many users with email ${email}`)
    return null;
  }
};

module.exports = {
  saveUser,
  getUsers,
  findUserByEmail,
  findUserById,
  setUserStatusVerifiedById,
}