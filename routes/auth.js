const express = require('express');
const router  = express.Router();
const User = require('../models/user');

const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;

//comment test

router.get('/signup', (req, res, next) => {
  res.render('authentication',{layout:false});
});

router.post('/signup', (req, res, next) => {
  let {username, password} = req.body
  
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  let user = new User({username, password: hashPass})
  user.save()
  .then(usr => {
    res.redirect('/dashboard');
  })
  .catch(err => {
    next(err)
  })
});

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

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



router.post("/signin", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("signin", {
      errorMessage: "Please enter both, username and password to sign in."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("signin", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/dashboard");
      } else {
        res.render("signin", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});


let isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/signin");
  }
}


module.exports = router;
