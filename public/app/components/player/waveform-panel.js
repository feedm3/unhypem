/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import ProgressPanel from './progress-panel';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';

class WaveformPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            waveformUrl: ''
        };
    }

    handleCurrentSongUpdate(songInfo) {
        this.setState({
            waveformUrl: songInfo.song.waveformUrl
        });
    }

    handleClick(waveformContainer) {
        waveformContainer.persist();
        const width = document.getElementById('waveform-container').offsetWidth;
        const clickedWidth = waveformContainer.nativeEvent.layerX;
        const percent = clickedWidth / width * 100;
        songDispatcher.dispatch(ACTION.FORCE_POSITION_IN_PERCENT, percent);
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
        songDispatcher.registerOnCurrentSongUpdate('WaveformPanel', this.handleCurrentSongUpdate.bind(this));
    }
}

export default WaveformPanel;
