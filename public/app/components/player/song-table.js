/**
 * @author Fabian Dietenberger
 */

import React from 'react';
import SongTableRow from './song-table-row';
import request from 'superagent';

class SongTable extends React.Component {
    constructor() {
        super();
        this.state = {
            songs: []
        };
    }

    componentDidMount() {
        request.get("http://localhost:3000/popular")
            .end((err, response)  => {
                const popular = JSON.parse(response.text);
                this.setState({
                    'songs': popular.songs
                });
            });
    }

    render() {
        const songTableRows = this.state.songs.map(function (song, index) {
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
