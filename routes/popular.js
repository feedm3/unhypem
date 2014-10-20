var express = require('express');
var dbAdapter = require('./../dbAdapter');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    dbAdapter.getPopularSongs(function (latestEntry) {
        res.json(latestEntry.songs);
    });
});

module.exports = router;
