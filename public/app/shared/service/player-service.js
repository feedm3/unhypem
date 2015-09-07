/**
 * @author Fabian Dietenberger
 */

'use strict';

(function(){
    var app = angular.module('player-service', []);

    app.service('playerService', function () {
        var currentSong = {},
            player = new Player(),
            forwardCallback,
            rewindCallback;

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

        this.forward = function () {
            if (forwardCallback) {
                forwardCallback();
            }
        };

        this.rewind = function () {
            if (rewindCallback) {
                rewindCallback();
            }
        };

        this.setVolume = function (volume) {
            player.setVolume(volume);
        };

        this.getProgressInSeconds = function () {
            return player.getProgressInSeconds();
        };

        this.setProgress = function (progress) {
            player.setPosition(progress);
        };

        this.isPlaying = function () {
            return player.isPlaying();
        };

        this.setProgressCallback = function(callback) {
            player.setProgressInSecondsCallback(callback);
        };

        this.setDurationCallback = function (callback) {
            player.setDurationInSecondsCallback(callback);
        };

        this.setOnPlayCallback = function (callback) {
            player.setOnPlayCallback(callback);
        };

        this.setOnPauseCallback = function (callback) {
            player.setOnPauseCallback(callback);
        };

        this.setOnFinishCallback = function (callback) {
            player.setOnFinishCallback(callback);
        };

        this.setOnForwardCallback = function (callback) {
            forwardCallback = callback;
        };

        this.setOnRewindCallback = function(callback) {
            rewindCallback = callback;
        };
    });
})();