/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import PlayerMediator from '../../player/player-mediator';

export default () => {
    return (
        <button type="button" className="btn button button-rewind no-select"
                onClick={ () => { PlayerMediator.rewind(); }}>
            <span className="hidden">Rewind</span>
        </button>
    );
};
