/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Tooltip from './../common/tooltip';
import ACTION from '../../constants/action';
import PLAYLIST_STATE from '../../constants/playlist-state';
import songDispatcher from '../../dispatcher/song-dispatcher';

export default class ShuffleButton extends React.Component {

    constructor() {
        super();
        this.state = {
            playlistState: {}
        };
    }

    handleClick() {
        if (this.state.playlistState === PLAYLIST_STATE.SHUFFLE_NEXT_SONG) {
            this.setState({
                playlistState: {}
            });
            songDispatcher.dispatch(ACTION.CHANGE_PLAYLIST_STATE, PLAYLIST_STATE.NEXT_POSITION);
        } else {
            this.setState({
                playlistState: PLAYLIST_STATE.SHUFFLE_NEXT_SONG
            });
            songDispatcher.dispatch(ACTION.CHANGE_PLAYLIST_STATE, PLAYLIST_STATE.SHUFFLE_NEXT_SONG);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.playlistState !== nextState.playlistState;
    }

    render() {
        const isActive = this.state.playlistState === PLAYLIST_STATE.SHUFFLE_NEXT_SONG;
        const isDeactiveStyle = isActive ? {'': ''} : {'opacity': '0.5'};
        return (
            <Tooltip text='Random next song'>
                <button type="button" onClick={this.handleClick.bind(this)}
                        className="icon-btn icon-btn-shuffle no-select " style={isDeactiveStyle}>
                    <span className="hide">Shuffle</span>
                </button>
            </Tooltip>
        );
    }
}
