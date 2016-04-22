/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import VolumePopup from './volume-popup';

export default class VolumeButton extends React.Component {

    constructor() {
        super();
    }

    toggleVolumePopup() {
        const volumePopup = this.refs.volumePopup;
        const isVisisble = volumePopup.state.visible;
        volumePopup.setState({visible: !isVisisble});
    }

    render() {
        return (
            <button type="button"
                    onClick={() => { this.toggleVolumePopup(); }}
                    className="icon-btn icon-btn-volume no-select">
                <span className="hide">Volume</span>
                <VolumePopup ref='volumePopup' onMouseLeave={() => { this.toggleVolumePopup(); }}/>
            </button>
        );
    }
}
