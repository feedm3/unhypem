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
import Tooltip from '../common/tooltip';
import SvgIcon from '../common/svg-icon';

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
        const {isSelected, usePropsToSelect} = this.state;

        let rowStyle = 'white';
        let tooltip = '';
        if (!song.streamUrl) {
            rowStyle = 'song-table-row-no-streaming-url';
            tooltip = 'Song cant be streamed';
        }

        if (song.streamUrl && (isSelected || (usePropsToSelect && selected))) {
            rowStyle = 'song-table-row-selected';
        }

        let soundcloudLogoStyle;
        let soundcloudClickHandler;
        if (song.soundcloudUrl) {
            soundcloudClickHandler = () => {
                window.open(song.soundcloudUrl, '_blank', null, null);
            };
        } else {
            soundcloudLogoStyle = 'song-table-cell-no-soundcloud-url';
        }

        return (
            <tr className={rowStyle} onClick={onClick.bind(this)} title={tooltip}>
                <td className="vertical-center text-center">
                    <Tooltip text={`❤ ${song.hypemLovedCount}`} size='s'>{song.position}</Tooltip>
                </td>
                <td className="vertical-center hidden-xs">
                    <SvgIcon
                        src='../../../assets/img/ic_soundcloud-black.svg#soundcloud-icon'
                        title='Soundcloud'
                        width='32'
                        height='32'
                        className={soundcloudLogoStyle}
                        onClick={soundcloudClickHandler}
                    />
                </td>
                <td className="vertical-center">{song.artist}</td>
                <td className="vertical-center"><strong>{song.title}</strong></td>
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
