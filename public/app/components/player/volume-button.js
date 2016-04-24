/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import VolumePopup from './volume-popup';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';

export default class VolumeButton extends React.Component {

    constructor() {
        super();
    }

    toggleVolumePopup() {
        const volumePopup = this.refs.volumePopup;
        const isVisisble = volumePopup.state.visible;
        volumePopup.setState({visible: !isVisisble});
    }

    onVolumeChange(percent) {
        songDispatcher.dispatch(ACTION.CHANGE_VOLUME, percent);
    }

    render() {
        return (
            <div className='volume-popup-wrapper'>
                <button type="button"
                        onClick={() => { this.toggleVolumePopup(); }}
                        className="icon-btn icon-btn-volume no-select">
                    <span className="hide">Volume</span>
                </button>
                <VolumePopup
                    ref='volumePopup'
                    onMouseLeave={() => { this.toggleVolumePopup(); }}
                    onProgressChange={(percent) => { this.onVolumeChange(percent); }}/>
            </div>
        );
    }
}
