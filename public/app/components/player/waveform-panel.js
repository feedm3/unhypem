/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import ProgressPanel from './progress-panel';
import PlayerMediator from '../../player/player-mediator';

class WaveformPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            waveformUrl: ''
        };
    }

    handleSongChange(song) {
        this.setState({
            waveformUrl: song.waveformUrl
        });
    }

    handleClick(waveformContainer) {
        waveformContainer.persist();
        const width = document.getElementById('waveform-container').offsetWidth;
        const clickedWidth = waveformContainer.nativeEvent.layerX;
        const percent = clickedWidth / width * 100;
        PlayerMediator.setPosition(percent);
    }

    render() {
        const waveformStyle = {backgroundImage: `url('${this.state.waveformUrl}')`};

        return (
            <div id='waveform-container' className="player-waveform-container" onClick={this.handleClick.bind(this)}>
                <div className="player-waveform" style={waveformStyle}></div>
                <ProgressPanel />
            </div>
        );
    }

    componentDidMount() {
        PlayerMediator.registerOnSongChangeCallback(this.handleSongChange.bind(this));
    }
}

export default WaveformPanel;
