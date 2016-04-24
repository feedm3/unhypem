/**
 * This component is used to display all songs in a table.
 *
 * @author Fabian Dietenberger
 */

import React from 'react';
import ReactDom from 'react-dom';
import SongTableRow from './song-table-row';
import Utils from '../common/utils';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';

export default class SongTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSong: {}
        };
    }

    handleCurrentSongUpdate(songInfo) {
        const newSongId = songInfo.song.id;
        const currentSongId = this.state.currentSong.id;

        if (newSongId !== currentSongId) {
            // get the current selected row. could be 'undefined' on the first click
            const selectedRow = this.refs[`${currentSongId}`];
            if (selectedRow) selectedRow.setSelected(false);

            // select the new one
            const rowToSelect = this.refs[`${newSongId}`];
            if (rowToSelect) {
                rowToSelect.setSelected(true);
                this.scrollToRow(rowToSelect);
            }

            this.setState({
                currentSong: songInfo.song
            });
        }
    }

    /**
     * Scoll to the given row IF NECESSARY. If the component is slightly below the visible
     * end of the table or slightly above the end of the visible table it will scroll the
     * body lower or higher.
     *
     * @param row the row component to scroll to
     */
    scrollToRow(row) {
        const rowToSelectDomNode = ReactDom.findDOMNode(row);

        const currentScrollPosition = Utils.getScrollTop(); // 0 = on top of the body
        const currentWindowHeight = window.innerHeight;
        const selectedRowPosition = rowToSelectDomNode.offsetTop; // 0 = on top of the table
        const distanceToBottom = 300;

        if (currentScrollPosition + currentWindowHeight < selectedRowPosition + distanceToBottom) {
            // row is slighly above the current visible window
            Utils.setScrollTop(selectedRowPosition + distanceToBottom - currentWindowHeight);
        } else if (currentScrollPosition > selectedRowPosition) {
            // row is above the current visible window
            Utils.setScrollTop(selectedRowPosition);
        }
    }

    handleRowClick(song) {
        if (this.state.currentSong.id === song.id) {
            songDispatcher.dispatch(ACTION.TOGGLE_PLAY);
        } else {
            songDispatcher.dispatch(ACTION.SELECT_SONG, song);
        }
    }

    render() {
        const currentSong = this.state.currentSong;

        const songTableRows = this.props.songs.map((song) => {
            return <SongTableRow song={song} selected={currentSong.id === song.id} key={song.position} ref={song.id}
                                 onClick={ () => this.handleRowClick(song) }/>;
        });

        return (
            <div>
                <table className="table table-hover song-table">
                    <thead>
                    <tr className="white">
                        <th />
                        <th className="hidden-xs"/>
                        <th>Artist</th>
                        <th>Title</th>
                    </tr>
                    </thead>
                    <tbody>
                    {songTableRows}
                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {
        songDispatcher.registerOnCurrentSongUpdate('SongTable', this.handleCurrentSongUpdate.bind(this));
        songDispatcher.dispatch(ACTION.GET_CURRENT_SONG);
    }

    componentWillUnmount() {
        songDispatcher.removeOnCurrentSongUpdate('SongTable');
    }
}
SongTable.propTypes = {
    songs: React.PropTypes.array.isRequired
};
