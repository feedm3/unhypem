/**
 * @author Fabian Dietenberger
 */

import React from 'react';
import ReactDom from 'react-dom';
import App from './components/app';

// preload the player with all songs and start loading the first song (that the player calculates the duration)

ReactDom.render(<App />, document.getElementById('main'));
