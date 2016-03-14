/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import InfoEntry from './info-entry';

export default () => {
    const body = <table className='shortcuts-info-entry'>
        <tbody>
        <tr>
            <td><kbd>Space</kbd></td>
            <td>play / pause</td>
        </tr>
        <tr>
            <td><kbd>&#8594;</kbd> / <kbd>&#8595;</kbd></td>
            <td>next song</td>
        </tr>
        <tr>
            <td><kbd>&#8592;</kbd> / <kbd>&#8593;</kbd></td>
            <td>previous song</td>
        </tr>
        </tbody>
    </table>;

    return (
        <InfoEntry className='hidden-xs hidden-sm' header='Shortcuts' body={body}/>
    );
};
