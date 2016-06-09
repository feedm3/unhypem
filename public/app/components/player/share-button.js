/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import TetherComponent from 'react-tether';
import SvgIcon from '../common/svg-icon';

export default class ShareButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popupVisible: false
        };
    }

    render() {
        const soundcloudUrlStyle = this.props.soundcloudUrl ? {
            display: 'block',
            paddingBottom: '5px'
        } : {display: 'none'};
        return (
            <div onClick={() => this.setState({popupVisible: !this.state.popupVisible}) }>
                <TetherComponent
                    attachment='bottom center'
                    offset='15px 0'
                    constraint={[{
                        to: 'window',
                        attachment: 'both'
                    }]}>
                    <SvgIcon
                        id='ic_share_black_24px'
                        title='Share'
                        width='24px'
                        height='24px'
                        onMouseEnter={() => this.setState({popupVisible: true}) }
                        onMouseLeave={() => this.setState({popupVisible: false}) }
                    />
                    {
                        this.state.popupVisible &&
                        <div>
                            <div className='share-button-popup' onMouseLeave={() => this.setState({popupVisible: false}) }>
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
                            <div style={{marginBottom: '-5px'}} className="tether-tooltip-triangle"></div>
                        </div>
                    }
                </TetherComponent>
            </div>
        );
    }
}
ShareButton.propTypes = {
    soundcloudUrl: React.PropTypes.string,
    hypemMediaId: React.PropTypes.string
};
