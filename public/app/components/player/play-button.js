/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import PlayerMediator from '../../player/player-mediator';

class PlayButton extends React.Component {
    constructor() {
        super();
        this.state = {
            isPlaying: false
        };
    }

    handleClick() {
        PlayerMediator.playSelectedSong();
        this.onTogglePlay();
    }

    onTogglePlay() {
        this.setState({
            isPlaying: PlayerMediator.isPlaying()
        });
    }

    componentDidMount() {
        PlayerMediator.registerOnTogglePauseCallback(this.onTogglePlay.bind(this));
    }

    render() {
        let buttonStyle = 'btn button button-play no-select';
        if (this.state.isPlaying) {
            buttonStyle += ' button-stop';
        } else {
            buttonStyle += ' button-play';
        }
        return (
            <button type="button" onClick={this.handleClick.bind(this)} className={buttonStyle}>
                <span className="hide">Play</span>
            </button>
        );
    }
}

export default PlayButton;
