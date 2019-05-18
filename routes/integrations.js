const express = require('express');
const router  = express.Router();
const AWS = require('aws-sdk')

/* GET integrations page. */
let isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/signin");
  }
}

// router.get('/integrations', isAuthenticated, (req, res, next) => {
router.get('/', (req, res, next) => {
  console.log('ok')
  res.render('integrations');
});


module.exports = router;