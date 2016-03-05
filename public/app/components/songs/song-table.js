/**
 * This component is used to display all songs in a table.
 *
 * @author Fabian Dietenberger
 */

import React from 'react';
import ReactDom from 'react-dom';
import SongTableRow from './song-table-row';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';
import moment from 'moment/min/moment.min';

class SongTable extends React.Component {
    constructor() {
        super();
        this.state = {
            songs: [],
            currentSong: {},
            timestamp: ''
        };
    }

    handleAllSongsUpdate(songsInfo) {
        this.setState({
            songs: songsInfo.songs,
            timestamp: songsInfo.timestamp
        });
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

        const currentScrollPosition = document.body.scrollTop; // 0 = on top of the body
        const currentWindowHeight = window.innerHeight;
        const selectedRowPosition = rowToSelectDomNode.offsetTop; // 0 = on top of the table
        const distanceToBottom = 300;

        if (currentScrollPosition + currentWindowHeight < selectedRowPosition + distanceToBottom) {
            // row is slighly above the current visible window
            document.body.scrollTop = selectedRowPosition + distanceToBottom - currentWindowHeight;
        } else if (currentScrollPosition > selectedRowPosition) {
            // row is above the current visible window
            document.body.scrollTop = selectedRowPosition;
        }
    }

    handleRowClick(song) {
        if (this.state.currentSong.id === song.id) {
            songDispatcher.dispatch(ACTION.TOGGLE_PLAY);
        } else {
            songDispatcher.dispatch(ACTION.SELECT_SONG, song);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.timestamp !== this.state.timestamp;
    }

    render() {
        const { timestamp, currentSong } = this.state;

        const songTableRows = this.state.songs.map((song) => {
            return <SongTableRow song={song} selected={currentSong.id === song.id} key={song.position} ref={song.id}
                                 onClick={ () => this.handleRowClick(song) }/>;
        });

        return (
            <div>
                <table className="table table-hover">
                    <thead>
                    <tr className="white">
                        <th />
                        <th className="hidden-xs"/>
                        <th>Artist</th>
                        <th>Title</th>
                        <th className="hidden-xs">Love</th>
                    </tr>
                    </thead>
                    <tbody>
                    {songTableRows}
                    </tbody>
                </table>
                <div className="text-center" title={timestamp}>Last updated {moment(timestamp).fromNow()}</div>
            </div>
        );
    }

    componentDidMount() {
        songDispatcher.registerOnAllSongsUpdate('SongTable', this.handleAllSongsUpdate.bind(this));
        songDispatcher.registerOnCurrentSongUpdate('SongTable', this.handleCurrentSongUpdate.bind(this));
        songDispatcher.dispatch(ACTION.GET_ALL_SONGS);
        songDispatcher.dispatch(ACTION.GET_CURRENT_SONG);
    }

    componentWillUnmount() {
        songDispatcher.removeOnALlSongsUpdate('SongTable');
        songDispatcher.removeOnCurrentSongUpdate('SongTable');
    }
}

export default SongTable;
