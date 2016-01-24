/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import PlayerMediator from '../../player/player-mediator';

export default () => {
    return (
        <button type="button" className="btn button button-forward no-select"
                onClick={() => PlayerMediator.forward()}>
            <span className="hidden">Forward</span>
        </button>
    );
};
