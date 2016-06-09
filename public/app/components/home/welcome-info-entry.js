/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import InfoEntry from './info-entry';

export default class WelcomeEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const body = <div>The charts are based on the <a className='no-link-style' href='http://hypem.com/popular' target='_blank'>hypem popular</a> charts.
            Last update was {this.props.timestamp}.</div>;

        return (
            <InfoEntry header='Welcome' body={body}/>
        );
    }
}
WelcomeEntry.propTypes = {
    timestamp: React.PropTypes.string.isRequired
};
