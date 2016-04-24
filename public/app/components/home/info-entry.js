/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default class InfoEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className='info-entry-header' >{this.props.header}</div>
                <div className='info-entry-body'>{this.props.body}</div>
            </div>
        );
    }
}
InfoEntry.propTypes = {
    header: React.PropTypes.string.isRequired,
    body: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
};
