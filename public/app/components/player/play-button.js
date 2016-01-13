/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Player from '../../player/player';

class PlayButton extends React.Component {
    constructor() {
        super();
        this.state = {
            isPlaying: false
        };
    }

    togglePlay() {
        console.log(this.state);

        if (this.state.isPlaying) {
            Player.stop('mySound');
        } else {
            Player.play('mySound');
        }
        this.setState({
            isPlaying: !this.state.isPlaying
        });
    }

    render() {
        let buttonStyle = 'btn button button-play no-select';
        if (this.state.isPlaying) {
            buttonStyle += ' button-stop';
        } else {
            buttonStyle += ' button-play';
        }
        return (
            <button type="button" onClick={this.togglePlay.bind(this)} className={buttonStyle}>
                <span className="hide">Play</span>
            </button>
        );
    }
}

export default PlayButton;
