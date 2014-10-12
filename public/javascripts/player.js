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
    _callbackNextSong = null;
    _callbackDurationInSeconds = null;
    _callbackWhileLoading = null;
    _callbackWhilePlaying = null;
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

Player.prototype.preloadSong = function (popularSongsDTO) {
    $.each(popularSongsDTO, function (i, song) {
        var urlToStream;
        if (song.s_stream)
            urlToStream = song.s_stream;
        else
            urlToStream = song.s_mp3;

        _soundManager.createSound({
            url: urlToStream,
            id: song.h_mediaid,
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
                if (_callbackNextSong) {
                    _callbackNextSong();
                }
            },
            whileloading: function () {
                if (_callbackWhileLoading) {
                    _callbackWhileLoading((this.bytesLoaded / this.bytesTotal) * 100);
                }
                if (this.duration) {
                    _callbackDurationInSeconds(parseInt(this.duration / 1000));
                }
            },
            whileplaying: function () {
                if (_callbackWhilePlaying) {
                    // return song progress in hundred percent
                    _callbackWhilePlaying(this.position / 1000, parseInt(this.duration / 1000));
                }
            }
        });
    });
};

Player.prototype.play = function (id) {
    if (_isPlaying) {
        _soundPlayer.pause();
    }
    // If same ID wants to be played, just pause the song
    if (_currentPlayId == id) {
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
 * @param volume: number between 0-100
 */
Player.prototype.setVolume = function (volume) {
    _volume = volume;
    if (_soundPlayer) {
        _soundPlayer.setVolume(_volume);
    }
}
/**
 * Fires when song starts playing
 *
 * @param callback
 */
Player.prototype.setCallbackOnPlay = function (callback) {
    _callbackOnPlay = callback;
};

Player.prototype.setCallbackOnPause = function (callback) {
    _callbackOnPause = callback;
};

Player.prototype.setCallbackNextSong = function (callback) {
    _callbackNextSong = callback;
};

Player.prototype.setCallbackWhileLoading = function (callback) {
    _callbackWhileLoading = callback;
};

Player.prototype.setCallbackDurationInSeconds = function (callback) {
    _callbackDurationInSeconds = callback;
};

Player.prototype.setCallbackWhilePlaying = function (callback) {
    _callbackWhilePlaying = callback;
};