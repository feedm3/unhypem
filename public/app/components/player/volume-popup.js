/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default class VolumePopup extends React.Component {

    constructor() {
        super();
        this.state = {
            visible: false,
            progressPercent: 100
        };
    }

    handleClick(ref) {
        ref.persist();
        console.log('Test');
        
        const height = document.getElementById('volume-popup').offsetHeight;
        const percent = height - ref.nativeEvent.offsetY;

        if (this.props.onProgressChange) this.props.onProgressChange(percent);
        this.setState({
            progressPercent: percent
        });

        ref.stopPropagation();
    }

    render() {
        if (!this.state.visible) return null;
        const negativeProgress = 100 - this.state.progressPercent;

        return (
            <div id='volume-popup' className='volume-popup' onClick={(e) => { this.handleClick(e); }}
                 onMouseLeave={this.props.onMouseLeave}>
                <div className='volume-popup-progress-negative' style={{height: negativeProgress + '%'}}></div>
            </div>
        );
    }
}
VolumePopup.propTypes = {
    onMouseLeave: React.PropTypes.func,
    onProgressChange: React.PropTypes.func
};

