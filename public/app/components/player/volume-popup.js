/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default class VolumePopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            progressPercent: 100
        };
    }

    handleInputChange(e) {
        const progressPercent = e.target.value;

        if (this.props.onProgressChange) this.props.onProgressChange(progressPercent);
        this.setState({
            progressPercent: progressPercent
        });
    }

    render() {
        if (!this.state.visible) return null;
        return (
            <div id='volume-popup' className='volume-popup' onMouseLeave={this.props.onMouseLeave}>
                <input type="range"
                       min="0"
                       max="100"
                       step="1"
                       defaultValue={this.state.progressPercent}
                       className="volume-input-range"
                       orient="vertical"
                       onChange={(e) => { this.handleInputChange(e); }}/>
            </div>
        );
    }
}
VolumePopup.propTypes = {
    onMouseLeave: React.PropTypes.func,
    onProgressChange: React.PropTypes.func
};

