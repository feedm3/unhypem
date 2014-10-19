var express = require('express');
var hypemCrawler = require('../hypemCrawler');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send(hypemCrawler.getPopularSongs());
});

module.exports = router;
