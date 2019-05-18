const express = require('express');
const router  = express.Router();

/* GET invoices page. */
let isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/signin");
  }
}

router.get('/invoices', isAuthenticated, (req, res, next) => {
  res.render('invoices');
});

module.exports = router;