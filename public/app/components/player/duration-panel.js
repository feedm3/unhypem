/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import songDispatcher from '../../dispatcher/song-dispatcher';

class DurationLabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            position: 0
        };
    }

    handleCurrentSongUpdate(songInfo) {
        const durationInMillis = songInfo.song.duration;
        const positionInPercent = songInfo.position;

        const durationInSeconds = durationInMillis / 1000;
        const positionInSeconds = (durationInSeconds * positionInPercent) / 100;

        this.setState({
            duration: durationInSeconds,
            position: positionInSeconds
        });
    }

    render() {
        const position = secondFormatter(this.state.position);
        const duration = secondFormatter(this.state.duration);
        return (
            <div className="duration">
                <div>{position}</div>
                <div>{duration}</div>
            </div>
        );
    }

    componentDidMount() {
        songDispatcher.registerOnCurrentSongUpdate('DurationLabel', this.handleCurrentSongUpdate.bind(this));
    }
}

/**
 * Converts seconds to mm:ss.
 *
 * @param second
 * @returns {string} mm:ss
 */
function secondFormatter(second) {
    const sec_num = parseInt(second, 10); // don't forget the second param
    const hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    return minutes + ':' + seconds;
}

export default DurationLabel;
