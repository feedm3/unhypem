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
        }
    }

    onDurationChange(seconds) {
        this.setState({
            duration: seconds
        });
    }

    onPositionChange(milliseconds) {
        this.setState({
            position: milliseconds
        });
    }

    componentDidMount() {
        PlayerMediator.registerOnDurationLoadedCallback(this.onDurationChange.bind(this));
        PlayerMediator.registerOnProgressCallback(this.onPositionChange.bind(this));
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.position !== this.state.position;
    }

    render() {
        const { duration, position } = this.state;
        let percentProgress = 0;

        if (duration !== 0) {
            percentProgress = (position / 1000) / duration * 100;
        }

        return (
            <div className="player-progressbar">
                <div className="player-progressbar-progress" style={{width: percentProgress + '%'}}></div>
            </div>
        );
    }
}

export default ProgressPanel;