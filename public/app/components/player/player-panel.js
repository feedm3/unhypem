/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import DurationPanel from './duration-panel';
import RewindButton from './rewind-button';
import PlayButton from './play-button';
import WaveformPanel from './waveform-panel';
import ForwardButton from './forward-button';
import RepeatButton from './repeat-button';
import ShuffleButton from './shuffle-button';
import ShareButton from './share-button';
import VolumeButton from './volume-button';
import Tooltip from './tooltip';
import ACTION from '../../constants/action';
import KEY_CODE from '../../constants/key-code';
import songDispatcher from '../../dispatcher/song-dispatcher';

class PlayerPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            song: {}
        };
    }

    handleAllSongsUpdate(songsInfo) {
        this.refs.repeatButton.setState({
            playlistState: songsInfo.playlistState
        });
        this.refs.shuffleButton.setState({
            playlistState: songsInfo.playlistState
        });
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
        const {song} = this.state;
        return (
            <div>
                <div className="container">
                    <div className="player-panel">
                        <div className="player-panel-col player-panel-col-song-position">
                            <Tooltip text={`${song.artist} - ${song.title}`}>
                                <strong>{song.position}</strong>
                            </Tooltip>
                        </div>
                        <div className="player-panel-col-duration">
                            <DurationPanel />
                        </div>
                        <div className="player-panel-col-btn" style={{'padding': '0'}}>
                            <RewindButton />
                        </div>
                        <div className="player-panel-col-btn player-panel-col-btn-play">
                            <PlayButton />
                        </div>
                        <WaveformPanel />
                        <div className="player-panel-col-btn" style={{'paddingLeft': '5px'}}>
                            <ForwardButton />
                        </div>
                        <div className="player-panel-col-btn">
                            <ShuffleButton ref='shuffleButton'/>
                        </div>
                        <div className="player-panel-col-btn">
                            <RepeatButton ref='repeatButton'/>
                        </div>
                        <div className="player-panel-col-btn">
                            <ShareButton />
                        </div>
                        <div className="player-panel-col-btn" style={{'padding': '0'}}>
                            <VolumeButton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDownEvent.bind(this));
        songDispatcher.registerOnCurrentSongUpdate('PlayerPanel', this.handleCurrentSongUpdate.bind(this));
        songDispatcher.registerOnAllSongsUpdate('PlayerPanel', this.handleAllSongsUpdate.bind(this));
    }
}

export default PlayerPanel;

