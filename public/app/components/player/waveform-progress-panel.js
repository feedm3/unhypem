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
            position: 0,
            color: ''
        };
    }
    
    updatePosition(position) {
        this.setState({position: position});
    }

    updateColor(color) {
        this.setState({color: color});
    }

    render() {
        return (
            <div className="player-progressbar" style={{backgroundColor: this.state.color}}>
                <div className="player-progressbar-progress" style={{width: this.state.position + '%'}}></div>
            </div>
        );
    }
}

export default ProgressPanel;
