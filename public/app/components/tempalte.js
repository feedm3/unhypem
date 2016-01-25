/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Header from './header/header';
import SongPlayer from './player/player-panel';

export default (props) => {
    return (
        <div>
            <Header />
            <div className="container">
                {props.children}
            </div>
            <div className="bottom">
                { /* put this in own bottom component */ }
                <SongPlayer />
            </div>
        </div>
    );
};
