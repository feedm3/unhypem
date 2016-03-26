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
        return (
            <div className='tooltip-top-160' data-text={this.props.text}>
                {this.props.children}
            </div>
        );
    }
}
Tooltip.propTypes = {
    children: React.PropTypes.node.isRequired,
    text: React.PropTypes.string
};
