/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import InfoEntry from './info-entry';

export default (props) => {
    const body = <div>The charts are based on the <a className='no-link-style' href='http://hypem.com/popular' target='_blank'>hypem popular</a> charts.
        Last update was {props.timestamp}.</div>;

    return (
        <InfoEntry header='Welcome' body={body}/>
    );
};
