/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import getSongs from '../../api/songs-api';
import VolumeBar from './volume-bar';
import RewindButton from './rewind-button';
import PlayButton from './play-button';
import WaveformPanel from './waveform-panel';
import ForwardButton from './forward-button';
import DurationLabel from './duration-label';
import PlayerMediator from '../../player/player-mediator';

class SongPlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            song: {}
        };
    }

    onSongChange(song) {
        this.setState({
            'song': song
        });
    }

    componentDidMount() {
        PlayerMediator.registerOnSongChangeCallback(this.onSongChange.bind(this));
        getSongs(songs => {
            this.setState({
                'song': songs[0]
            });
        });
    }

    render() {
        const { song } = this.state;
        return (
            <div>
                <div className="container">
                    <div className="player-flex-wrapper">
                        <div className="player-info hidden-xs">
                            <strong>{song.title}</strong>
                            <span>{song.artist}</span>
                            <VolumeBar />
                        </div>
                        <div className="player-control-two">
                            <RewindButton />
                            <PlayButton />
                        </div>
                        <WaveformPanel />
                        <div className="player-control-one">
                            <ForwardButton />
                        </div>
                        <div className="player-secondary">
                            <DurationLabel />
                            <div className="link">
                                <a href={`http://hypem.com/track/${song.hypemMediaId}`} target="_blank">Hypem</a>
                            </div>
                            <div className="link">
                                <a href={song.soundcloudUrl} target="_blank">Soundcloud</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SongPlayer;

