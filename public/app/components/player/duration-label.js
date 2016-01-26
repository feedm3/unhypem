/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import PlayerMediator from '../../player/player-mediator';

class DurationLabel extends React.Component {
    constructor() {
        super();
        this.state = {
            duration: 0,
            position: 0
        };
    }

    handleSongLoaded() {
        this.setState({
            duration: PlayerMediator.getDuration()
        });
    }

    handlePositionChange(millis) {
        this.setState({
            position: millis / 1000
        });
    }

    render() {
        const position = secondFormatter(this.state.position);
        const duration = secondFormatter(this.state.duration);
        return (
            <div className="duration">
                <span>{position} / {duration}</span>
            </div>
        );
    }

    componentDidMount() {
        PlayerMediator.registerOnLoadedCallback(this.handleSongLoaded.bind(this));
        PlayerMediator.registerOnProgressCallback(this.handlePositionChange.bind(this));
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
