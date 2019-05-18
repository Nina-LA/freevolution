const express = require('express');
const router  = express.Router();

/* GET dashboard page. */
let isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/signin");
  }
}

router.get('/', isAuthenticated, (req, res, next) => {
  console.log('dashboard error')
  res.render('dashboard');
});

module.exports = router;