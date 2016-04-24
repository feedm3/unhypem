/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import WaveformProgressPanel from './waveform-progress-panel';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';

export default class WaveformPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waveformUrl: ''
        };
    }

    handleCurrentSongUpdate(songInfo) {
        this.setState({
            waveformUrl: songInfo.song.waveformUrl
        });

        const position = songInfo.positionUpdate ? songInfo.positionUpdatePosition : songInfo.position;
        this.refs.waveformProgressPanel.updatePosition(position);
    }

    handleClick(waveformContainer) {
        waveformContainer.persist();
        const width = document.getElementById('waveform-container').offsetWidth;
        const clickedWidth = waveformContainer.nativeEvent.layerX;
        const percent = clickedWidth / width * 100;
        songDispatcher.dispatch(ACTION.FORCE_POSITION_IN_PERCENT, percent);
    }

    handleMouseOver() {
        this.refs.waveformProgressPanel.updateColor('#899AB3');
    }

    handleMouseOut() {
        this.refs.waveformProgressPanel.updateColor('');
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.waveformUrl !== this.state.waveformUrl;
    }

    render() {
        const wavefromUrl = this.state.waveformUrl;
        const waveformBackgroundStyle = wavefromUrl ? 'url(' + wavefromUrl + ')' : '';
        const waveformStyle = {backgroundImage: waveformBackgroundStyle};

        return (
            <div id='waveform-container' className='player-waveform-container' onClick={this.handleClick.bind(this)}
                 onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
                <div className='player-waveform' style={waveformStyle}></div>
                <WaveformProgressPanel ref="waveformProgressPanel"/>
            </div>
        );
    }

    componentDidMount() {
        songDispatcher.registerOnCurrentSongUpdate('WaveformPanel', this.handleCurrentSongUpdate.bind(this));
    }
}
