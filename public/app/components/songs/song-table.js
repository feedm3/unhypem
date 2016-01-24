/**
 * This component is used to display all songs in a table.
 *
 * @author Fabian Dietenberger
 */

import React from 'react';
import SongTableRow from './song-table-row';
import getSongs from '../../api/songs-api';
import PlayerMediator from '../../player/player-mediator';

class SongTable extends React.Component {
    constructor() {
        super();
        this.state = {
            songs: [],
            selectedSongId: 0
        };
    }

    componentDidMount() {
        PlayerMediator.registerOnSongChangeCallback(this.onSongChang.bind(this));
        getSongs(songs => {
            this.setState({
                'songs': songs
            });
        });
    }

    onSongChang(song) {
        if (song.id !== this.state.selectedSongId) {
            // get the current selected row. could be 'undefined' on the first click
            const selectedRow = this.refs[`${this.state.selectedSongId}`];
            if (selectedRow) selectedRow.setSelected(false);

            // select the specific row
            this.refs[`${song.id}`].setSelected(true);
            this.setState({
                selectedSongId: song.id
            });
        }
    }

    handleRowClick(song) {
        PlayerMediator.setSelectedSong(song);
        PlayerMediator.playSelectedSong();
        this.onSongChang(song);
    }

    shouldComponentUpdate(nextProps, nextState) {
        // only re-render the whole table when the songs have changed
        return nextState.songs !== this.state.songs;
    }

    render() {
        const songTableRows = this.state.songs.map((song, index) => {
            return <SongTableRow song={song} key={song.position} ref={song.id}
                                 onClick={this.handleRowClick.bind(this, song)}/>;
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
                <div className="text-center" title="{{dateTime}}">Last updated Bla</div>
            </div>
        );
    }
}

export default SongTable;
