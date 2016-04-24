/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Tooltip from './../common/tooltip';
import ACTION from '../../constants/action';
import songDispatcher from '../../dispatcher/song-dispatcher';

export default class RepeatButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            repeatCurrentSong: false
        };
    }

    handleClick() {
        const newRepeatCurrentSong = !this.state.repeatCurrentSong;
        this.setState({
            repeatCurrentSong: newRepeatCurrentSong
        });
        songDispatcher.dispatch(ACTION.REPEAT_CURRENT_SONG, newRepeatCurrentSong);
    }

    render() {
        const isActive = this.state.repeatCurrentSong;
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
