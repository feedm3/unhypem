/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import SvgIcon from '../common/svg-icon';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';

export default () => {
    return (
        <SvgIcon
            id='ic_skip_next_black_24px'
            title="Forward"
            width="36px"
            height="36px"
            onClick={() => songDispatcher.dispatch(ACTION.FORWARD)}
        />
    );
};
