/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import VolumePopup from './volume-popup';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';
import SvgIcon from '../common/svg-icon';

export default class VolumeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 100
        };
    }

    toggleVolumePopup() {
        const volumePopup = this.refs.volumePopup;
        const isVisisble = volumePopup.state.visible;
        volumePopup.setState({visible: !isVisisble});
    }

    showVolumePopup() {
        this.refs.volumePopup.setState({visible: true});
    }

    onVolumeChange(percent) {
        songDispatcher.dispatch(ACTION.CHANGE_VOLUME, percent);
        this.setState({volume: percent});
    }

    render() {
        let volumeIcon = 'ic_volume_up_black_24px';
        if (this.state.volume === 0) {
            volumeIcon = 'ic_volume_off_black_24px';
        } else if (this.state.volume > 0 && this.state.volume < 50) {
            volumeIcon = 'ic_volume_down_black_24px';
        } else if (this.state.volume >= 50) {
            volumeIcon = 'ic_volume_up_black_24px';
        }

        return (
            <div className='popup-wrapper'>
                <SvgIcon
                    id={volumeIcon}
                    title="Volume"
                    width="24px"
                    height="24px"
                    onMouseEnter={() => { this.showVolumePopup(); }}
                    onClick={() => { this.toggleVolumePopup(); }}
                />
                <VolumePopup
                    ref='volumePopup'
                    onMouseLeave={() => { this.toggleVolumePopup(); }}
                    onProgressChange={(percent) => { this.onVolumeChange(percent); }}/>
            </div>
        );
    }
}
