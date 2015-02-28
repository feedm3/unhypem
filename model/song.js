/**
 * The Song object is used to specify the song schema.
 */
Song = function () {
    this.artist = "";
    this.title = "";
    this.mp3Url = ""; // most times from soundcloud
    this.streamUrl = ""; // most times from soundcloud
    this.hypemMediaId = "";
    this.hypemLovedCount = 0;
    this.soundcloudId = "";
    this.soundcloudUrl = "";
};

exports.createNewSong = function () {
    return new Song();
};