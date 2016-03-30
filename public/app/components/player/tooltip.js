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
        let styles = 'tooltip-top-160';
        if (this.props.direction === 'right') {
            styles += ' tooltip-top-160-right';
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
    direction: React.PropTypes.oneOf(['right'])
};
