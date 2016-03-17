/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';

export default () => {
    return (
        <button type="button" className="icon-btn icon-btn-forward no-select"
                onClick={() => songDispatcher.dispatch(ACTION.FORWARD)}>
            <span className="hidden">Forward</span>
        </button>
    );
};
