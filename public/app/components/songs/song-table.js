/**
 * This component is used to display all songs in a table.
 *
 * @author Fabian Dietenberger
 */

import React from 'react';
import SongTableRow from './song-table-row';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';
import moment from 'moment/min/moment.min';

class SongTable extends React.Component {
    constructor() {
        super();
        this.currentSelectedSongId = 0;
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
        // get the current selected row. could be 'undefined' on the first click
        const selectedRow = this.refs[`${this.currentSelectedSongId}`];
        if (selectedRow) selectedRow.setSelected(false);

        // select the new one
        this.currentSelectedSongId = songInfo.song.id;
        this.refs[`${this.currentSelectedSongId}`].setSelected(true);
    }

    handleRowClick(song) {
        if (this.currentSelectedSongId === song.id) {
            songDispatcher.dispatch(ACTION.TOGGLE_PLAY);
        } else {
            songDispatcher.dispatch(ACTION.SELECT_SONG, song);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.timestamp !== this.state.timestamp;
    }

    render() {
        const timestamp = this.state.timestamp;
        const songTableRows = this.state.songs.map((song) => {
            return <SongTableRow song={song} key={song.position} ref={song.id}
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
        songDispatcher.dispatch(ACTION.GET_ALL_SONGS); // TODO maybe notify every component directly after it is registered
    }

    componentWillUnmount() {
        songDispatcher.removeOnALlSongsUpdate('SongTable');
        songDispatcher.removeOnCurrentSongUpdate('SongTable');
    }
}

export default SongTable;
