/**
 * This component is used to display a song as a table row. It also displays the songs streaming url status with a
 * corresponding background color.
 *
 * The component does not implement any click handler logic. It can only delegate to a click handler from the properties.
 *
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import Tooltip from '../player/tooltip';

class SongTableRow extends React.Component {
    constructor() {
        super();
        this.state = {
            isSelected: false,
            usePropsToSelect: true
        };
    }

    setSelected(isSelected) {
        this.setState({
            isSelected: isSelected,
            usePropsToSelect: false
        });
    }

    render() {
        const {song, onClick, selected} = this.props;

        let rowStyle = 'warning';
        if (song.streamUrl) {
            rowStyle = 'white';
            if (this.state.isSelected || (this.state.usePropsToSelect && selected)) {
                rowStyle = 'info';
            }
        }

        const soundcloudLogoStyle = song.soundcloudUrl ? 'soundcloud-logo' : 'soundcloud-logo no-soundcloud-url';

        return (
            <tr className={rowStyle} onClick={onClick.bind(this)}>
                <td className="vertical-center text-center">
                    <Tooltip text={`❤ ${song.hypemLovedCount}`} size='s'>{song.position}</Tooltip>
                </td>
                <td className="vertical-center hidden-xs">
                    <a className={soundcloudLogoStyle} target="_blank" href={song.soundcloudUrl}/>
                </td>
                <td className="vertical-center">{song.artist}</td>
                <td className="vertical-center"><strong>{song.title}</strong></td>
                <td className="vertical-center hidden-xs">{song.hypemLovedCount}</td>
            </tr>
        );
    }
}

SongTableRow.propTypes = {
    song: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool
};

export default SongTableRow;
