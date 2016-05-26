/**
 * This component can be used to add a tooltip to an existing component.
 *
 * The existing component must be passed as child of the tooltip and the tooltip text itself must be passed as property.
 *
 * @author Fabian Dietenberger
 */

'use strict';
 
import React from 'react';
import TetherComponent from 'react-tether';

export default class SimpleTooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    render() {
        const { isOpen } = this.state;

        // construct props conditionally
        const props = {
            attachment: this.props.attachment,
            constraints: [{
                to: 'window',
                attachment: 'both'
            }]
        };
        if (this.props.targetAttachment) {
            props.targetAttachment = this.props.targetAttachment;
        }

        // construct styles
        // TODO this is a 'quickfix' and could be done better
        const triangleStyle = {};
        if (this.props.targetAttachment === 'bottom left') {
            triangleStyle.right = 'initial';
            triangleStyle.left = '10px';
        }

        return (
            <TetherComponent {...props}>
                <div onMouseEnter={() => this.setState({isOpen: true}) }
                     onMouseLeave={() => this.setState({isOpen: false}) }>{this.props.children}</div>
                {
                    isOpen &&
                    <div className='tether-tooltip'>
                        <div className='tether-tooltip-content'>{this.props.text}</div>
                        <div className='tether-tooltip-triangle' style={triangleStyle}></div>
                    </div>
                }
            </TetherComponent>
        );
    }
}
SimpleTooltip.propTypes = {
    children: React.PropTypes.node.isRequired,
    text: React.PropTypes.string.isRequired,
    attachment: React.PropTypes.oneOf(['top left', 'top center', 'top right', 'bottom left', 'bottom center', 'bottom right']),
    targetAttachment: React.PropTypes.oneOf(['top left', 'top center', 'top right', 'bottom left', 'bottom center', 'bottom right'])
};
SimpleTooltip.defaultProps = {
    attachment: 'top center'
};
