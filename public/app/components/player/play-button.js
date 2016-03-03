/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';
import SONG_STATE from '../../constants/song-state';

class PlayButton extends React.Component {
    constructor() {
        super();
        this.state = {
            songState: SONG_STATE.PAUSED
        };
    }

    handleClick() {
        switch (this.state.songState) {
            case SONG_STATE.PAUSED:
                songDispatcher.dispatch(ACTION.PLAY);
                break;
            case SONG_STATE.PLAYING:
                songDispatcher.dispatch(ACTION.PAUSE);
                break;
        }
    }

    handleCurrentSongUpdate(songInfo) {
        this.setState({
            songState: songInfo.state
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.songState !== this.state.songState;
    }

    render() {
        let buttonStyle = 'btn button button-play no-select';
        if (this.state.songState === SONG_STATE.PLAYING) {
            buttonStyle += ' button-pause';
        } else {
            buttonStyle += ' button-play';
        }
        return (
            <button type="button" onClick={this.handleClick.bind(this)} className={buttonStyle}>
                <span className="hide">Play</span>
            </button>
        );
    }

    componentDidMount() {
        songDispatcher.registerOnCurrentSongUpdate('PlayButton', this.handleCurrentSongUpdate.bind(this));
    }
}

export default PlayButton;
