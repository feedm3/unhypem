/**
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
        return (
            <TetherComponent
                attachment={this.props.attachment}
                constraints={[{
                    to: 'window',
                    attachment: 'both'
                }]}
            >
                <div onClick={() => this.setState({isOpen: !isOpen}) }>{this.props.children}</div>
                {
                    isOpen &&
                    <div>
                        <div>{this.props.text}</div>
                        <div className="tether-tooltip-triangle"></div>
                    </div>
                }
            </TetherComponent>
        );
    }
}
SimpleTooltip.propTypes = {
    children: React.PropTypes.node.isRequired,
    text: React.PropTypes.string.isRequired,
    attachment: React.PropTypes.oneOf(['top left', 'top center', 'top right'])
};
SimpleTooltip.defaultProps = {
    attachment: 'top center'
};
