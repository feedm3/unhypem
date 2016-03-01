/**
 * This component is used to display all songs in a table.
 *
 * @author Fabian Dietenberger
 */

import React from 'react';
import SongTableRow from './song-table-row';
import { getSongsAndTimestamp } from '../../api/songs-api';
import isEqual from 'lodash/isEqual';
import PlayerMediator from '../../player/player-mediator';
import moment from 'moment/min/moment.min';

class SongTable extends React.Component {
    constructor() {
        super();
        this.state = {
            songs: [],
            selectedSongId: 0,
            timestamp: ''
        };
    }

    handleSongChange(song) {
        if (song.id !== this.state.selectedSongId) {
            // get the current selected row. could be 'undefined' on the first click
            const selectedRow = this.refs[`${this.state.selectedSongId}`];
            if (selectedRow) selectedRow.setSelected(false);

            // select the specific row
            this.refs[`${song.id}`].setSelected(true);
            this.setState({
                selectedSongId: song.id
            });
            // gets called twice!
        }
    }

    handleRowClick(song) {
        PlayerMediator.setSelectedSong(song);
        PlayerMediator.playSelectedSong();
        this.handleSongChange(song);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.state.songs, nextState.songs);
    }

    render() {
        const timestamp = this.state.timestamp;
        const songTableRows = this.state.songs.map((song, index) => {
            if (index === this.state.selectedSongId) {
                console.log('Song already selected: ' + index);
            }
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

    componentDidUpdate() {
        PlayerMediator.setSelectedSong(this.state.songs[0]);
    }

    componentDidMount() {
        PlayerMediator.registerOnSongChangeCallback('SongTable', this.handleSongChange.bind(this));
        getSongsAndTimestamp(songsAndTimestamp => {
            this.setState({
                'songs': songsAndTimestamp.songs,
                'timestamp': songsAndTimestamp.timestamp
            });
        });
    }

    componentWillUnmount() {
        PlayerMediator.removeOnSongChangeCallback('SongTable');
    }
}

export default SongTable;
