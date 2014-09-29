var express = require('express');
var hypemAdapter = require('../hypemAdapter');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send(hypemAdapter.getPopularSongs());
});

module.exports = router;
