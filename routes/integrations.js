const express = require('express');
const router  = express.Router();


/* GET integrations page. */
let isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/signin");
  }
}

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://mail.google.com/'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}

function listMessages(auth) {
  let  userId = 'me';
  let query = 'facture has:attachment after:2019/3/21 before:2019/5/22';
  let callback = (res) => console.log(res);
  const gmail = google.gmail({version: 'v1', auth});
  var initialRequest = gmail.users.messages.list({
    'userId': userId,
    'q': query
  }).then(resp => {
    console.log(resp.data.messages)
    Promise.all(resp.data.messages.map(mess => {return getMessage(mess.id, auth)}))
    .then(liste_messages => {
      console.log(liste_messages[0])
      return Promise.all(liste_messages.map(mess => {return getAttachments(mess.data, auth)}))
    })
    .then(liste_factures => {
      console.log('attach', liste_factures[0])
    })
  })
}

/**
 * Get Message with given ID.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} messageId ID of Message to get.
 * @param  {Function} callback Function to call when the request is complete.
 */
function getMessage(messageId, auth) {
  let  userId = 'me';
  const gmail = google.gmail({version: 'v1', auth});
  console.log('id 2 mess', messageId)
  return gmail.users.messages.get({
    'userId': userId,
    'id': messageId
  })
}

/**
 * Get Attachments from a given Message.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} messageId ID of Message with attachments.
 * @param  {Function} callback Function to call when the request is complete.
 */
function getAttachments(message, auth) {
  const gmail = google.gmail({version: 'v1', auth});
  console.log('mess 2 attachements', message.payload)
  let  userId = 'me';

  var parts = message.payload.parts;
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (part.filename && part.filename.length > 0) {
      var attachId = part.body.attachmentId;
      return gmail.users.messages.attachments.get({
        'id': attachId,
        'messageId': message.id,
        'userId': userId
      });
      // request.execute(function(attachment) {
      //   callback(part.filename, part.mimeType, attachment);
      // });
    }
  }
}
// router.get('/integrations', isAuthenticated, (req, res, next) => {
router.get('/', (req, res, next) => {
  console.log('ok')
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listMessages);
  });

  // listMessages('me','facture', (result) => {
  //   console.log(result)
  // })
  res.render('integrations');
});




module.exports = router;