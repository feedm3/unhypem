/**
 * @author Fabian Dietenberger
 */

import React from 'react';
import ReactDom from 'react-dom';
import App from './components/app';
import '../assets/css/style.css';
import '../assets/css/buttons.css';
import '../assets/css/player.css';

ReactDom.render(<App />, document.getElementById('main'));
