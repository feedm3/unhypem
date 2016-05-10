/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import SvgIcon from '../common/svg-icon';

export default class ShareButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    // TODO refactor this class and the popup concept (styling)

    togglePopup() {
        const sharePopup = document.getElementById('sharePopup');
        if (!sharePopup.style.display || sharePopup.style.display === 'none') {
            sharePopup.style.display = 'block';
        } else {
            sharePopup.style.display = 'none';
        }
    }

    render() {
        const soundcloudUrlStyle = this.props.soundcloudUrl ? {display: 'block', paddingBottom: '5px'} : {display: 'none'};
        return (
            <div>
                <SvgIcon
                    id='ic_share_black_24px'
                    title='Share'
                    width='24px'
                    height='24px'
                    onClick={() => this.togglePopup() }
                />
                <div className='popup-wrapper'>
                    <div className='share-popup'
                         id='sharePopup'
                         onMouseLeave={() => this.togglePopup()}>
                        <a href={this.props.soundcloudUrl}
                           target='_blank'
                           style={soundcloudUrlStyle}
                           className='share-popup-link'>
                            Open on soundcloud
                        </a>
                        <a href={'http://hypem.com/track/' + this.props.hypemMediaId}
                           target='_blank'
                           className='share-popup-link'>
                            Open on hypem
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
ShareButton.propTypes = {
    soundcloudUrl: React.PropTypes.string,
    hypemMediaId: React.PropTypes.string
};
