/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import SvgIcon from '../common/svg-icon';
import SimpleTooltip from '../common/simple-tooltip';
import ACTION from '../../constants/action';
import PLAYLIST_STATE from '../../constants/playlist-state';
import songDispatcher from '../../dispatcher/song-dispatcher';

export default class ShuffleButton extends React.Component {
    constructor(props) {
        super(props);
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
        const isActiveStyle = isActive ? {'': ''} : {'opacity': '0.5'};
        return (
                <SimpleTooltip text='Random next song'>
                    <SvgIcon
                        id='ic_shuffle_black_24px'
                        title='Shuffle'
                        width='24px'
                        height='24px'
                        style={isActiveStyle}
                        onClick={() => this.handleClick()}
                    />
                </SimpleTooltip>
        );
    }
}

