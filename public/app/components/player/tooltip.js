/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default class Tooltip extends React.Component {

    constructor() {
        super();
    }
    
    render() {
        let styles = 'tooltip-top';
        switch (this.props.size) {
            case 's':
                styles += ' tooltip-top-80';
                break;
            case 'm':
                styles += ' tooltip-top-160';
                break;
        }

        if (this.props.direction === 'right') {
            styles += ' tooltip-top-right';
        }
        return (
            <div className={styles} data-text={this.props.text}>
                {this.props.children}
            </div>
        );
    }
}
Tooltip.propTypes = {
    children: React.PropTypes.node.isRequired,
    text: React.PropTypes.string,
    direction: React.PropTypes.oneOf(['right', 'center']),
    size: React.PropTypes.oneOf(['s', 'm'])
};
Tooltip.defaultProps = {
    direction: 'center',
    size: 'm'
};
