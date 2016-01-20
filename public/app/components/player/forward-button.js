/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default () => {
    return (
        <button type="button" className="btn button button-forward no-select" onClick={() => { console.log('Forward song'); }}>
            <span className="hidden">Forward</span>
        </button>
    );
};
