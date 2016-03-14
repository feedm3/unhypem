/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default (props) => {
    return (
        <div>
            <div className='info-entry-header' >{props.header}</div>
            <div className='info-entry-body'>{props.body}</div>
        </div>
    );
};
