var soundManager,
    soundPlayer;

Player = function () {
    _soundManager = soundManager;
    _soundPlayer = soundPlayer;
    _isPlaying = false;
    _volume = 100;
    _currentPlayId = "";
    _callbackOnPlay = null;
    _callbackOnPause = null;
    _callbackFinish = null;
    _callbackDurationInSeconds = null;
    _callbackWhileLoading = null;
    _callbackProgressInSeconds = null;
};

Player.prototype.init = function () {
    _soundManager.url = '/swfs/';
    _soundManager.flashVersion = 9;
    _soundManager.useFlashBlock = false;
    _soundManager.useHighPerformance = true;
    _soundManager.wmode = 'transparent';
    _soundManager.useFastPolling = true;
    _soundManager.waitForWindowLoad = true;
    _soundManager.volume = _volume;
};

Player.prototype.isPlaying = function () {
    return _isPlaying;
};

Player.prototype.preloadSong = function (songs) {
    _.forEach(songs, function (song) {
        _soundManager.createSound({
            url: song.streamUrl,
            id: song.hypemMediaId,
            onplay: function () {
                _isPlaying = true;
                if (_callbackOnPlay) {
                    _callbackOnPlay();
                }
                if (this.readyState == 3 && _callbackDurationInSeconds) {
                    _callbackDurationInSeconds(parseInt(this.duration / 1000));
                }
            },
            onpause: function () {
                _isPlaying = false;
                if (_callbackOnPause) {
                    _callbackOnPause();
                }
            },
            onresume: function () {
                _isPlaying = true;
                if (_callbackOnPlay) {
                    _callbackOnPlay();
                }
            },
            onfinish: function () {
                if (_callbackFinish) {
                    _callbackFinish();
                }
            },
            whileloading: function () {
                if (_callbackWhileLoading) {
                    _callbackWhileLoading((this.bytesLoaded / this.bytesTotal) * 100);
                }
                if (this.duration && _callbackDurationInSeconds) {
                    _callbackDurationInSeconds(parseInt(this.duration / 1000));
                }
            },
            whileplaying: function () {
                if (_callbackProgressInSeconds) {
                    // return song progress in seconds
                    _callbackProgressInSeconds(this.position / 1000, parseInt(this.duration / 1000));
                }
            }
        });
    });
};

Player.prototype.play = function (id) {
    // If same ID wants to be played, just pause the song
    if (_currentPlayId == id) {
        if (_isPlaying) {
            _soundPlayer.pause();
            return;
        }

        _soundPlayer.play();
        _soundPlayer.setVolume(_volume)
    } else {
        // If new song wants to be played
        // reset the previous so it doesn't start
        // playing in the last position if restarted
        _currentPlayId = id;
        if (_soundPlayer) {
            _soundPlayer.stop();
        }
        _soundPlayer = _soundManager.getSoundById(_currentPlayId);
        _soundPlayer.play();
        _soundPlayer.setVolume(_volume)
    }
};

/**
 * Pause current song
 */
Player.prototype.pause = function () {
    _soundPlayer.pause();
};

/**
 * Jump to given position in song
 *
 * @param hundredPercent position in the song between 0-100
 */
Player.prototype.setPosition = function (hundredPercent) {
    if (_soundPlayer) {
        _soundPlayer.setPosition((_soundPlayer.duration / 100) * hundredPercent);
    }
};

/**
 * Set new volume
 *
 * @param volume number between 0-100
 */
Player.prototype.setVolume = function (volume) {
    _volume = volume;
    if (_soundPlayer) {
        _soundPlayer.setVolume(_volume);
    }
};

/**
 * Fires when song starts playing
 *
 * @param callback
 */
Player.prototype.setOnPlayCallback = function (callback) {
    _callbackOnPlay = callback;
};

Player.prototype.setOnPauseCallback = function (callback) {
    _callbackOnPause = callback;
};

Player.prototype.setOnFinishCallback = function (callback) {
    _callbackFinish = callback;
};

Player.prototype.setWhileLoadingCallback = function (callback) {
    _callbackWhileLoading = callback;
};

/**
 * Returns the duration of the song in seconds.
 *
 * @param callback
 */
Player.prototype.setDurationInSecondsCallback = function (callback) {
    _callbackDurationInSeconds = callback;
};

/**
 * Return the progress in seconds.
 *
 * @param callback
 */
Player.prototype.setProgressInSecondsCallback = function (callback) {
    _callbackProgressInSeconds = callback;
};