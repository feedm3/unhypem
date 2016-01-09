/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';

export default (props) => {
    const song = props.song;

    let soundcloudLogoStyle = 'soundcloud-logo';
    if (!song.soundcloudUrl) {
        soundcloudLogoStyle += ' no-soundcloud-url';
    }

    let rowStyle = song.streamUrl ? 'white' : 'warning';

    return (
        <tr className={rowStyle}>
            <td className="vertical-center text-center">{song.position}</td>
            <td className="vertical-center hidden-xs">
                <a className={soundcloudLogoStyle} target="_blank" href={song.soundcloudUrl}/>
            </td>
            <td className="vertical-center">{song.artist}</td>
            <td className="vertical-center"><strong>{song.title}</strong></td>
            <td className="vertical-center hidden-xs">{song.hypemLovedCount}</td>
        </tr>
    );
};
