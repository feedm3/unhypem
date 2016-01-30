/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import PlayerMediator from '../../player/player-mediator';

class ProgressPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            duration: 0,
            position: 0
        };
    }

    handleSongLoaded() {
        this.setState({
            duration: PlayerMediator.getDuration(),
            position: 0
        });
    }

    handlePositionChange(milliseconds) {
        this.setState({
            position: milliseconds
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.position !== this.state.position;
    }

    render() {
        const { duration, position } = this.state;
        let percentProgress = 0;

        if (duration !== 0) {
            if (position / 1000 >= duration - 1) {
                // go to 0 before the last seconds
                percentProgress = 0;
            } else {
                percentProgress = (position / 1000) / duration * 100;
            }
        }

        return (
            <div className="player-progressbar">
                <div className="player-progressbar-progress" style={{width: percentProgress + '%'}}></div>
            </div>
        );
    }

    componentDidMount() {
        PlayerMediator.registerOnLoadedCallback(this.handleSongLoaded.bind(this));
        PlayerMediator.registerOnProgressCallback(this.handlePositionChange.bind(this));
    }
}

export default ProgressPanel;
