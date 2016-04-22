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
        console.log("Servs", ref);
        ref.stopPropagation();
        // volumeBarRef.persist(); // to get all values from the event from react
        //
        // const width = document.getElementById('volumebar').offsetWidth;
        // const clickedWidth = volumeBarRef.nativeEvent.layerX;
        // const percent = clickedWidth / width * 100;
        //
        // songDispatcher.dispatch(ACTION.CHANGE_VOLUME, percent);
        //
        // this.setState({
        //     volumePercent: percent
        // });

    }

    render() {
        if (!this.state.visible) return null;

        return (
            <div className='volume-popup' onClick={(e) => { this.handleClick(e); }} onMouseLeave={this.props.onMouseLeave}>
                <div className='volume-popup-progress'></div>
            </div>
        );
    }
}
VolumePopup.propTypes = {
    onMouseLeave: React.PropTypes.func
};

