/**
 * Created by Fabian on 29.09.2014.
 *
 * Persists PopularSongDTO in MongoDB
 * Adds current date for further data analysis
 */

var monk = require('monk');
var db = monk('localhost:27017/unhypem');

exports.storePopularSongs = function (popularSongsDTO) {

}