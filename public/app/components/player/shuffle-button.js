/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import ACTION from '../../constants/action';
import PLAYLIST_STATE from '../../constants/playlist-state';
import songDispatcher from '../../dispatcher/song-dispatcher';

export default class ShuffleButton extends React.Component {

    constructor() {
        super();
        this.state = {
            playlistState: PLAYLIST_STATE.NEXT_POSITION
        };
    }

    handleClick() {
        switch (this.state.playlistState) {
            case PLAYLIST_STATE.SHUFFLE_NEXT_SONG:
                songDispatcher.dispatch(ACTION.CHANGE_PLAYLIST_STATE, PLAYLIST_STATE.NEXT_POSITION);
                break;
            default:
                songDispatcher.dispatch(ACTION.CHANGE_PLAYLIST_STATE, PLAYLIST_STATE.SHUFFLE_NEXT_SONG);
                break;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.playlistState !== nextState.playlistState;
    }

    render() {
        const isActive = this.state.playlistState === PLAYLIST_STATE.SHUFFLE_NEXT_SONG;
        const isDeactiveStyle = isActive ? {'': ''} : {'opacity': '0.5'};
        return (
            <button type="button" onClick={this.handleClick.bind(this)}
                    className="icon-btn icon-btn-shuffle no-select " style={isDeactiveStyle}
                    data-toggle="tooltip" data-placement="top" title="Random next song">
                <span className="hide">Shuffle</span>
            </button>
        );
    }
}

