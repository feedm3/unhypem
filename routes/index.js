var express = require('express');
var router = express.Router();

var songs;

/* GET home page. */
router.get('/', function (req, res) {
    songs = [];
    var hypemAdapter = req.hypemAdapter;
    songs = hypemAdapter.getPopularSongs();

    /*var popular = db.get('popular');
    popular.insert({
            "date": new Date(),
            "songs": songs
        }, function (err, doc) {
            if (err) {
                res.send("Problem with db");
            } else {
                console.log("New DB entry.");
            }
        }
    );

    popular.find({}, {}, function (e, docs) {
        console.log(docs[0].songs);
        res.render('index', {"songs": docs[0].songs});
    });*/
    res.render('index', {"songs": songs});
});



module.exports = router;
