/**
 * @author Fabian Dietenberger
 */

import React from 'react';
import SongTableRow from './song-table-row';
import getSongs from '../../api/songs-api';

class SongTable extends React.Component {
    constructor() {
        super();
        this.state = {
            songs: []
        };
    }

    componentDidMount() {
        getSongs(songs => {
            this.setState({
                'songs': songs
            });
        });
    }

    render() {
        const songTableRows = this.state.songs.map(function(song, index) {
            return <SongTableRow song={song} key={index}/>;
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
