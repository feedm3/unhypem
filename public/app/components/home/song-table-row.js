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
import SimpleTooltip from '../common/simple-tooltip';
import SvgIcon from '../common/svg-icon';

export default class SongTableRow extends React.Component {
    constructor(props) {
        super(props);
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
        const {song, selected} = this.props;
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
            soundcloudClickHandler = (e) => {
                window.open(song.soundcloudUrl, '_blank', null, null);
                e.stopPropagation();
            };
        } else {
            soundcloudLogoStyle = 'song-table-cell-no-soundcloud-url';
        }

        return (
            <tr className={rowStyle} onClick={ () => { this.props.onClick(); }} title={tooltip}>
                <td className="vertical-center text-center">
                    <SimpleTooltip
                        text={`❤ ${song.hypemLovedCount}`}
                        attachment='bottom center'>
                        <span>{song.position}</span>
                    </SimpleTooltip>
                </td>
                <td className="vertical-center hidden-xs">
                    <SvgIcon
                        id='ic_soundcloud-black'
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
