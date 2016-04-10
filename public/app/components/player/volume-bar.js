/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';

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

        songDispatcher.dispatch(ACTION.CHANGE_VOLUME, percent);

        this.setState({
            volumePercent: percent
        });
    }

    render() {
        return (
            <div className="volumebar-container">
                <div className="volumebar-icon-minus"></div>
                <div id='volumebar' className="volumebar-progress" onClick={this.setVolume.bind(this)}>
                    <div className="volumebar-progress-bar" style={{width: this.state.volumePercent + '%'}}></div>
                </div>
                <div className="volumebar-icon-plus"></div>
            </div>
        );
    }
}

export default VolumeBar;
