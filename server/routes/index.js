var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/*', (req, res, next) => {
  fs.readFile('./public/index.html', 'utf-8', function (err, data) {
    if (err) {
      throw err;
    }
    res.set('Content-Type', 'text/html');
    res.send(data);
  });
});

module.exports = router;
