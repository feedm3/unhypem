/**
 * @author Fabian Dietenberger
 */

'use strict';

var soundManager,
    soundPlayer;

function Player() {
    this.ID_PREFIX = "s_";
    this.READY = false;

    this._soundManager = soundManager;
    this._soundPlayer = soundPlayer;
    this._isPlaying = false;
    this._volume = 100;
    this._progressInSeconds = 0;
    this._currentPlayId = "";
    this._callbackOnPlay = null;
    this._callbackOnPause = null;
    this._callbackFinish = null;
    this._callbackDurationInSeconds = null;
    this._callbackWhileLoading = null;
    this._callbackProgressInSeconds = null;
}

Player.prototype.init = function () {
    this._soundManager.url = '/swfs/';
    this._soundManager.flashVersion = 9;
    this._soundManager.useFlashBlock = false;
    this._soundManager.useHighPerformance = true;
    this._soundManager.wmode = 'transparent';
    this._soundManager.useFastPolling = true;
    this._soundManager.waitForWindowLoad = true;
    this._soundManager.volume = this._volume;
};

Player.prototype.isPlaying = function () {
    return this._isPlaying;
};

Player.prototype.preloadSong = function (songs) {
    var that = this;
    _.forEach(songs, function (song) {
        if (!_.isString(song.streamUrl)) {
            return;
        }
        that._soundManager.createSound({
            url: song.streamUrl,
            id: that.ID_PREFIX + song.hypemMediaId,
            onplay: function () {
                that._isPlaying = true;
                if (that._callbackOnPlay) {
                    that._callbackOnPlay();
                }
                if (this.readyState === 3 && that._callbackDurationInSeconds) {
                    that._callbackDurationInSeconds(parseInt(this.duration / 1000));
                }
            },
            onpause: function () {
                that._isPlaying = false;
                if (that._callbackOnPause) {
                    that._callbackOnPause();
                }
            },
            onresume: function () {
                that._isPlaying = true;
                if (that._callbackOnPlay) {
                    that._callbackOnPlay();
                }
            },
            onfinish: function () {
                if (that._callbackFinish) {
                    that._callbackFinish();
                }
            },
            whileloading: function () {
                if (that._callbackWhileLoading) { // sekunden werden nicht richtig gespeichert. scope problem mit this und that
                    that._callbackWhileLoading((this.bytesLoaded / this.bytesTotal) * 100);
                }
                if (this.duration && that._callbackDurationInSeconds) {
                    that._callbackDurationInSeconds(parseInt(this.duration / 1000));
                }
            },
            whileplaying: function () {
                if (that._callbackProgressInSeconds) {
                    // return song progress in seconds
                    that._progressInSeconds = this.position / 1000;
                    that._callbackProgressInSeconds(that._progressInSeconds);
                }
            }
        });
    });
    that.READY = true;
};

/**
 * Check if the given id exists in the player and can be played.
 *
 * @param id the id of the song
 * @returns {boolean} true if song exists and can be played
 */
Player.prototype.hasId = function (id) {
    return !!this._soundManager.getSoundById(this.ID_PREFIX + id);
};

/**
 * Check if the player has been preloaded.
 * If the player is not preloaded most of the
 * functions do not work.
 *
 * @returns {boolean} true if player has been preloaded
 */
Player.prototype.isReady = function () {
    return this.READY;
};

/**
 * Play a song.
 *
 * @param id the id of the song
 */
Player.prototype.play = function (id) {
    // If same ID wants to be played, just pause the song
    if (this._currentPlayId === id) {
        if (this._isPlaying) {
            this._soundPlayer.pause();
            return;
        }

        this._soundPlayer.play();
        this._soundPlayer.setVolume(this._volume);
    } else {
        // If new song wants to be played
        // reset the previous so it doesn't start
        // playing in the last position if restarted
        this._currentPlayId = id;
        if (this._soundPlayer) {
            this._soundPlayer.stop();
        }
        this._soundPlayer = this._soundManager.getSoundById(this.ID_PREFIX + this._currentPlayId);
        this._soundPlayer.play();
        this._soundPlayer.setVolume(this._volume);
    }
};

/**
 * Pause current song
 */
Player.prototype.pause = function () {
    this._soundPlayer.pause();
};

/**
 * Jump to given position in song
 *
 * @param hundredPercent position in the song between 0-100
 */
Player.prototype.setPosition = function (hundredPercent) {
    if (this._soundPlayer) {
        this._soundPlayer.setPosition((this._soundPlayer.duration / 100) * hundredPercent);
        if (this._callbackProgressInSeconds) {
            this._callbackProgressInSeconds(((this._soundPlayer.duration / 100) * hundredPercent) / 1000);
        }
    }
};

/**
 * Set new volume
 *
 * @param volume number between 0-100
 */
Player.prototype.setVolume = function (volume) {
    this._volume = volume;
    if (this._soundPlayer) {
        this._soundPlayer.setVolume(this._volume);
    }
};

/**
 * Get the current position of the songs progress in seconds.
 *
 * @returns {number} seconds
 */
Player.prototype.getProgressInSeconds = function () {
    return this._progressInSeconds;
};

/**
 * Fires when song starts playing
 *
 * @param callback
 */
Player.prototype.setOnPlayCallback = function (callback) {
    this._callbackOnPlay = callback;
};

Player.prototype.setOnPauseCallback = function (callback) {
    this._callbackOnPause = callback;
};

Player.prototype.setOnFinishCallback = function (callback) {
    this._callbackFinish = callback;
};

Player.prototype.setWhileLoadingCallback = function (callback) {
    this._callbackWhileLoading = callback;
};

/**
 * Returns the duration of the song in seconds.
 *
 * @param callback
 */
Player.prototype.setDurationInSecondsCallback = function (callback) {
    this._callbackDurationInSeconds = callback;
};

/**
 * Return the progress in seconds.
 *
 * @param callback
 */
Player.prototype.setProgressInSecondsCallback = function (callback) {
    this._callbackProgressInSeconds = callback;
};