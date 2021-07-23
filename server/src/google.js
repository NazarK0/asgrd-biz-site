const path = require('path');
const fs = require('fs');
const {google} = require('googleapis');

const keyfile = path.join(__dirname,'../..', 'credentials.json');
const keys = JSON.parse(fs.readFileSync(keyfile));
const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const client = new google.auth.OAuth2(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

this.authorizeUrl = client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

module.exports = {
  client
}