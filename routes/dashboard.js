const express = require('express');
const router  = express.Router();
const AWS = require('aws-sdk')

/* GET dashboard page. */
let isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/signin");
  }
}

router.get('/', isAuthenticated, (req, res, next) => {
  console.log('dashboard error')
  res.render('dashboard');
});

router.get('/get_cost', (req, res, next) => {
  AWS.config.update({region:'us-east-1'});
  var params = {
    TimePeriod: { /* required */
      End: '2019-04-01', /* required */
      Start: '2019-01-01' /* required */
    },
    Metrics: [
      'UnblendedCost'
    ],
    Granularity: 'MONTHLY',
  };
  var costexplorer = new AWS.CostExplorer();
  costexplorer.getCostAndUsage(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data.ResultsByTime);           // successful response
      res.send(data.ResultsByTime)
    }
  }); 
});

module.exports = router;