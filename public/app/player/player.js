/**
 * @author Fabian Dietenberger
 */

'use strict';

import { SoundManager } from 'soundmanager2';

const soundManager = new SoundManager();

const Player = {
    init() {
        console.log(SoundManager);

        soundManager.setup({
            url: '/swfs/',
            flashVersion: 9,
            useFlashBlock: false,
            useHighPerformance: true,
            wmode: 'transparent',
            waitForWindowLoad: true,
            debugMode: false,
            onready: () => {
                soundManager.createSound({
                    id: 'mySound',
                    url: 'https://api.soundcloud.com/tracks/240881664/stream?client_id=ae22eeed80859593bd5159ce968b1d38',
                    autoLoad: true,
                    autoPlay: false,
                    onload: () => {
                        console.log('Song loaded');
                    }
                });
            }
        });
    },

    play(songId) {
        soundManager.play('mySound');
    },

    stop(songId) {
        soundManager.stop(songId);
    },

    setVolume(percent = 100) {
        soundManager.setVolume(percent);
    }

};
Player.init();

export default Player;
