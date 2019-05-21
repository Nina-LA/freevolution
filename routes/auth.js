const express = require('express');
const router  = express.Router();
const User = require('../models/user');

const passport         = require("passport");
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;

//comment test
let isAuthenticated = (req, res, next) => {
  console.log(req.user)
  if (req.user) {
    next();
  } else {
    res.redirect("/signin");
  }
}

router.get('/signup', (req, res, next) => {
  res.render('authentication',{layout:false});
});

router.post('/signup', (req, res, next) => {
  let {firstName, lastName, email, username, password} = req.body
  
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  let user = new User({firstName, lastName, email,username, password: hashPass})
  user.save()
  .then(usr => {
    res.redirect('/dashboard');
  })
  .catch(err => {
    next(err)
  })
});

router.get('/signin', (req, res, next) => {
  res.render('signin',{layout:false});
});

router.get('/signout', (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/signin")
  })
});

router.get('/user', isAuthenticated, (req, res, next) => {
  res.send({user: req.session.currentUser});
});



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

router.get('/google/callback', (req, res, next) => {
  var credentials = JSON.parse(fs.readFileSync("credentials.json"));
  const {client_secret, client_id, redirect_uris} = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  oAuth2Client.getToken(req.query.code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) return console.error(err);
      console.log('Token stored to', TOKEN_PATH);
    });
    listMessages(oAuth2Client);
  });
});


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
  let query = 'facture';
  let callback = (res) => console.log(res);
  const gmail = google.gmail({version: 'v1', auth});
  var getPageOfMessages = function(request, result) {
    request.execute(function(resp) {
      result = result.concat(resp.messages);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gmail.users.messages.list({
          'userId': userId,
          'pageToken': nextPageToken,
          'q': query
        });
        getPageOfMessages(request, result);
      } else {
        callback(result);
      }
    });
  };
  var initialRequest = gapi.client.gmail.users.messages.list({
    'userId': userId,
    'q': query
  });
  getPageOfMessages(initialRequest, []);
}
// authRoutes.post("/signin", (req, res, next) => {
//   passport.authenticate("local", (err, theUser, failureDetails) => {
//     if (err) {
//       res.render('index', {error: "Something went wrong."})
//       return;
//     }

//     if (!theUser) {
//       // "failureDetails" contains the error messages
//       // from our logic in "LocalStrategy" { message: '...' }.
//       res.render('index', {error: "The user does not exist."})
//       return;
//     }

//     // save user in session
//     req.login(theUser, err => {
//       if (err) {
//         res.render('index', {error: "Something went wrong."})
//         return;
//       }

//       // We are now logged in (that's why we can also send req.user)
//       res.status(200).json(theUser);
//     });
//   })(req, res, next);
// });

router.post("/signin", (req,res,next)=>{console.log("izi"); next();}, passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/signin",
    passReqToCallback: true
  })
)
// router.post("/signin", (req, res, next) => {
//   const theUsername = req.body.username;
//   const thePassword = req.body.password;

//   if (theUsername === "" || thePassword === "") {
//     res.render("signin", {
//       errorMessage: "Please enter both, username and password to sign in."
//     });
//     return;
//   }

//   User.findOne({ "username": theUsername })
//   .then(user => {
//       if (!user) {
//         res.render("signin", {
//           errorMessage: "The username doesn't exist."
//         });
//         return;
//       }
//       if (bcrypt.compareSync(thePassword, user.password)) {
//         // Save the login in the session!
//         req.session.currentUser = user;
//         console.log(user)
//         res.redirect("/dashboard");
//       } else {
//         res.render("signin", {
//           errorMessage: "Incorrect password"
//         });
//       }
//   })
//   .catch(error => {
//     next(error);
//   })
// });

module.exports = router;

