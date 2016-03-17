/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';

export default () => {
    return (
        <button type="button" className="icon-btn icon-btn-rewind no-select"
                onClick={ () => { songDispatcher.dispatch(ACTION.REWIND); }}>
            <span className="hidden">Rewind</span>
        </button>
    );
};
