/**
 * @author Fabian Dietenberger
 */

'use strict';

import { SoundManager } from 'soundmanager2';
import _ from 'lodash';
import getSongs from '../api/songs-api';

class Player {

    constructor() {
        this.isPlaying = false;
        this.currentSongId = '';
        this.soundManager = new SoundManager();
        this.smSound = null; // soundManager creates a smSound for every song. this object holds the playing smSound

        this.soundManager.setup({
            url: '/swfs/',
            flashVersion: 9,
            useFlashBlock: false,
            useHighPerformance: true,
            wmode: 'transparent',
            waitForWindowLoad: true,
            debugMode: false,
            onready: () => {
                getSongs((songs) => {
                    this.preloadSongs(songs);
                });
            }
        });
    }

    preloadSongs(songs) {
        _.forEach(songs, (song) => {
            if (!_.isString(song.streamUrl)) {
                return;
            }
            this.soundManager.createSound({
                url: song.streamUrl,
                id: song.id,
                stream: true
            });
        });
    }

    play(songId) {
        // If same ID wants to be played, just pause the song
        if (this.currentSongId === songId) {
            if (this.smSound.paused === true) {
                this.smSound.play();
            } else {
                this.smSound.pause();
            }
        } else {
            // If new song wants to be played
            // reset the previous so it doesn't start
            // playing in the last position if restarted
            this.currentSongId = songId;
            if (this.smSound) {
                this.smSound.stop();
            }
            this.smSound = this.soundManager.getSoundById(songId);
            this.smSound.play();
        }
    }

    stop(songId) {
        this.soundManager.stop(songId);
    }

    setVolume(percent = 100) {
        this.soundManager.setVolume(percent);
    }
}

const player = new Player();
player.soundManager.onready(() => {
    getSongs((songs) => {
        player.preloadSongs(songs);
    });
});

export default new Player();
