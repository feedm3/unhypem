/**
 * @author Fabian Dietenberger
 */

import React from 'react';
import SongTableRow from './song-table-row';

class SongTable extends React.Component {
    constructor() {
        super();
        this.state = {
            songs: [
                {
                    'id': 1057,
                    'artist': 'Kiiara',
                    'title': 'Feels (Felix Cartal Remix)',
                    'hypemMediaId': '2esxt',
                    'hypemLovedCount': 3429,
                    'streamUrl': 'https://api.soundcloud.com/tracks/240678348/stream?client_id=ae22eeed80859593bd5159ce968b1d38',
                    'soundcloudUrl': 'http://soundcloud.com/felixcartal/kiiara-feels-felix-cartal-remix',
                    'soundcloudId': '240678348',
                    'waveformUrl': 'https://w1.sndcdn.com/qD5jb5DXBuD3_m.png',
                    'position': 1

                },
                {
                    'id': 1078,
                    'artist': 'Sia',
                    'title': 'Reaper (feat. Kanye West)',
                    'hypemMediaId': '2etea',
                    'hypemLovedCount': 1974,
                    'streamUrl': 'http://poponandon.com/wp-content/uploads/2016/01/07-Reaper-Ft.-Kanye-West.mp3',
                    'soundcloudUrl': null,
                    'soundcloudId': null,
                    'waveformUrl': null,
                    'position': 2
                },
                {
                    'id': 85,
                    'artist': 'Mura Masa',
                    'title': 'Love For That (feat. Shura)',
                    'hypemMediaId': '2dpga',
                    'hypemLovedCount': 4611,
                    'streamUrl': null,
                    'soundcloudUrl': 'http://soundcloud.com/muramasamusic/love-for-that',
                    'soundcloudId': null,
                    'waveformUrl': null,
                    'position': 19
                }
            ]
        };
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
