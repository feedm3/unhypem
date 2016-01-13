/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Player from '../../player/player';

class VolumeBar extends React.Component {
    constructor() {
        super();
        this.state = {
            volumePercent: 100
        };
    }

    setVolume(volumeBarRef) {
        volumeBarRef.persist(); // to get all values from the event from react

        const width = document.getElementById('volumebar').offsetWidth;
        const clickedWidth = volumeBarRef.nativeEvent.layerX;
        const percent = clickedWidth / width * 100;

        Player.setVolume(percent);

        this.setState({
            volumePercent: percent
        });
    }

    render() {
        let volumeBarProgressStyle = {width: this.state.volumePercent + '%'};
        if (this.state.volumePercent > 95) {
            Object.assign(volumeBarProgressStyle, {borderBottomRightRadius: 5, borderTopRightRadius: 5});
        }
        return (
            <div className="volumebar-container">
                <div className="volumebar-icon-minus"></div>
                <div id='volumebar' className="volumebar-progress" onClick={this.setVolume.bind(this)}>
                    <div className="volumebar-progress-bar" style={volumeBarProgressStyle}></div>
                </div>
                <div className="volumebar-icon-plus"></div>
            </div>
        );
    }
}

export default VolumeBar;