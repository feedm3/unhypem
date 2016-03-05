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
                    <div className="player-flex-wrapper">
                        <div className="player-info hidden-xs">
                            <strong>{song.title}</strong>
                            <span>{song.artist}</span>
                            <VolumeBar />
                        </div>
                        <div className="player-control-two">
                            <RewindButton />
                            <PlayButton />
                        </div>
                        <WaveformPanel />
                        <div className="player-control-one">
                            <ForwardButton />
                        </div>
                        <div className="player-secondary">
                            <DurationLabel />
                            <div className="link">
                                <a href={`http://hypem.com/track/${song.hypemMediaId}`} target="_blank">Hypem</a>
                            </div>
                            <div className="link">
                                <a href={song.soundcloudUrl} target="_blank">Soundcloud</a>
                            </div>
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

