const path = require('path')
const { google } = require('googleapis')

const SPREADSHEET_ID = '1yeZ7tozJHKGjRJtCAISlDyeRY28sPWt5_AnsBO7CEno'
const scopes = ['https://www.googleapis.com/auth/spreadsheets']

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../../..', 'credentials2.json'),
  scopes,
})

const getGoogleSheetsMain = async (req, res) => {
  const client = await auth.getClient()
  const googleSheets = google.sheets({ version: 'v4', auth: client })

  const metadata = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId: SPREADSHEET_ID,
  })

  const mainSheetName = metadata.data.sheets[0].properties.title

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: SPREADSHEET_ID,
    range: mainSheetName,
  })

  res.send(getRows.data)
}
const postGoogleSheetsAddUser = async (req, res) => {
  const {accountName, login, password, phoneNumber, authentificator} = req.body;
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
    range: mainSheetName,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [
          '',
          accountName,
          login,
          password,
          phoneNumber,
          authentificator,
          new Date().toLocaleDateString('uk'),
          'idifididi',
          '',
          '',
        ],
      ],
    },
  })

  res.sendStatus(200)
}

module.exports = {
  getGoogleSheetsMain,
  postGoogleSheetsAddUser,
}
