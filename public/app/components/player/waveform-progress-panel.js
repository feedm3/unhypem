/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import songDispatcher from '../../dispatcher/song-dispatcher';

export default class ProgressPanel extends React.Component {
    constructor(props) {
        super(props);
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
