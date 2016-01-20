/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Player from '../../player/player';

class RewindButton extends React.Component {

    render() {
        return (
            <button type="button" className="btn button button-rewind no-select" ng-click="rewind()">
                <span className="hidden">Rewind</span>
            </button>
        );
    }
}

export default () => {
    return (
        <button type="button" className="btn button button-rewind no-select" onClick={ () => { console.log('Rewind song'); }}>
            <span className="hidden">Rewind</span>
        </button>
    );
};