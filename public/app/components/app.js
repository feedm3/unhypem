/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Template from './tempalte';
import SongTable from './songs/song-table';
import About from './about/about';
import Imprint from './imprint/imprint';
import { Router, Route, IndexRoute } from 'react-router';

export default () => {
    return (
        <Router>
            <Route path="/" component={Template}>
                <IndexRoute component={SongTable}/>
                <Route path="about" component={About}/>
                <Route path="imprint" component={Imprint}/>
            </Route>
        </Router>
    );
};
