/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import VolumeBar from './volume-bar';
import RewindButton from './rewind-button';
import PlayButton from './play-button';
import WaveformPanel from './waveform-panel';
import ForwardButton from './forward-button';
import DurationLabel from './duration-label';
import ACTION from '../../constants/action';
import KEY_CODE from '../../constants/key-code';
import songDispatcher from '../../dispatcher/song-dispatcher';

class SongPlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            song: {}
        };
    }

    handleCurrentSongUpdate(songInfo) {
        this.setState({
            'song': songInfo.song
        });
    }

    handleKeyDownEvent(event) {
        switch (event.keyCode) {
            case KEY_CODE.RIGHT:
            case KEY_CODE.DOWN:
                songDispatcher.dispatch(ACTION.FORWARD);
                event.preventDefault();
                break;
            case KEY_CODE.LEFT:
            case KEY_CODE.UP:
                songDispatcher.dispatch(ACTION.REWIND);
                event.preventDefault();
                break;
            case KEY_CODE.SPACE:
                songDispatcher.dispatch(ACTION.TOGGLE_PLAY);
                event.preventDefault();
                break;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.song.id !== this.state.song.id;
    }

    render() {
        const { song } = this.state;
        return (
            <div>
                <div className="container">
                    <div className="player-panel">
                        <div className="player-panel-col player-panel-col-song-position">
                            <strong>{song.position}</strong>
                        </div>
                        <div className="player-panel-col player-panel-col-duration">
                            <div>00:00</div>
                            <div>03:35</div>
                        </div>
                        <div>
                            <RewindButton />
                        </div>
                        <div className="player-panel-col player-panel-col-btn-play">
                            <PlayButton />
                        </div>
                        <WaveformPanel />
                        <div className="player-panel-col" style={{'padding-left': '10px'}}>
                            <ForwardButton />
                        </div>
                        <div className="player-panel-col">
                            <button type="button" className="icon-btn icon-btn-repeat no-select">
                                <span className="hide">Repeat</span>
                            </button>
                        </div>
                        <div className="player-panel-col">
                            <button type="button" className="icon-btn icon-btn-shuffle no-select">
                                <span className="hide">Repeat</span>
                            </button>
                        </div>
                        <div className="player-panel-col">
                            <button type="button" className="icon-btn icon-btn-share no-select">
                                <span className="hide">Repeat</span>
                            </button>
                        </div>
                        <div className="player-panel-col">
                            <button type="button" className="icon-btn icon-btn-volume no-select">
                                <span className="hide">Repeat</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDownEvent.bind(this));
        songDispatcher.registerOnCurrentSongUpdate('PlayerPanel', this.handleCurrentSongUpdate.bind(this));
    }
}

export default SongPlayer;

