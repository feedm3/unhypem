(function(){
    var app = angular.module('song-service', []);

    app.service('sharedProperties', function () {
        var currentSong = {
            artist: "",
            title: "",
            s_url: "",
            stream: "",
            h_mediaid: ""
        };
        var player = new Player();
        player.init();

        this.getCurrentSong = function () {
            return currentSong;
        };
        this.setCurrentSong = function (value) {
            currentSong.artist = value.artist;
            currentSong.title = value.title;
            currentSong.s_url = value.s_url;
            currentSong.stream = value.stream;
            currentSong.h_mediaid = value.h_mediaid;
        };
        this.preloadSongs = function (value) {
            player.preloadSong(_.pluck(value, "song"));
        };
        this.play = function (value) {
            player.play(value);
        };
    });
})();