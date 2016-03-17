/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import songDispatcher from '../../dispatcher/song-dispatcher';

class ProgressPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            position: 0
        };
    }

    handleCurrentSongUpdate(songInfo) {
        const position = songInfo.positionUpdate ? songInfo.positionUpdatePosition : songInfo.position;
        this.setState({
            position: position
        });
    }

    render() {
        return (
            <div className="player-progressbar">
                <div className="player-progressbar-progress" style={{width: this.state.position + '%'}}></div>
            </div>
        );
    }

    componentDidMount() {
        songDispatcher.registerOnCurrentSongUpdate('ProgressPanel', this.handleCurrentSongUpdate.bind(this));
    }
}

export default ProgressPanel;
