/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Tooltip from './../common/tooltip';
import ACTION from '../../constants/action';
import PLAYLIST_STATE from '../../constants/playlist-state';
import songDispatcher from '../../dispatcher/song-dispatcher';

export default class RepeatButton extends React.Component {
    constructor() {
        super();
        this.state = {
            playlistState: PLAYLIST_STATE.NEXT_POSITION
        };
    }

    handleClick() {
        switch (this.state.playlistState) {
            case PLAYLIST_STATE.REPEAT_CURRENT_SONG:
                songDispatcher.dispatch(ACTION.CHANGE_PLAYLIST_STATE, PLAYLIST_STATE.NEXT_POSITION);
                break;
            default:
                songDispatcher.dispatch(ACTION.CHANGE_PLAYLIST_STATE, PLAYLIST_STATE.REPEAT_CURRENT_SONG);
                break;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.playlistState !== nextState.playlistState;
    }

    render() {
        const isActive = this.state.playlistState === PLAYLIST_STATE.REPEAT_CURRENT_SONG;
        const isDeactiveStyle = isActive ? {'': ''} : {'opacity': '0.5'};

        return (
            <Tooltip text='Repeat current song'>
                <button type="button" onClick={this.handleClick.bind(this)}
                        className='icon-btn icon-btn-repeat no-select' style={isDeactiveStyle}>
                    <span className="hide">Repeat</span>
                </button>
            </Tooltip>
        );
    }
}
