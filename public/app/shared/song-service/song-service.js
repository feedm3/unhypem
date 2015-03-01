(function(){
    var app = angular.module('song-service', []);

    app.service('sharedProperties', function () {
        var currentSong = {};
        var player = new Player();
        player.init();


        this.getCurrentSong = function () {
            return currentSong;
        };
        this.setCurrentSong = function (song) {
            _.assign(currentSong, song);
        };
        this.preloadSongs = function (songArray) {
            player.preloadSong(songArray);
        };
        this.play = function (hypemMediaId) {
            player.play(hypemMediaId);
        };
        this.setProgressCallback = function(callback) {
            player.setCallbackWhilePlaying(callback);
        };
    });
})();