const express = require('express');
const router  = express.Router();


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