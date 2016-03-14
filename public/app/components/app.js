/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Template from './tempalte';
import Home from './home/home';
import About from './about/about';
import Imprint from './imprint/imprint';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

export default () => {
    return (
        <Router history={hashHistory}>
            <Route path="/" component={Template}>
                <IndexRoute component={Home}/>
                <Route path="about" component={About}/>
                <Route path="imprint" component={Imprint}/>
            </Route>
        </Router>
    );
};
