/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import VolumeBar from './volume-bar';
import RewindButton from './rewind-button';
import PlayButton from './play-button';
import WaveformPanel from './waveform-panel';
import ForwardButton from './forward-button';
import DurationLabel from './duration-label';
import songDispatcher from '../../dispatcher/song-dispatcher';

class SongPlayer extends React.Component {
    constructor() {
        super();
        this.state = {
            song: {}
        };
    }

    handleCurrentSongUpdate(songInfo) {
        this.setState({
            'song': songInfo.song
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.song.id !== this.state.song.id;
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

    componentDidMount() {
        songDispatcher.registerOnCurrentSongUpdate('PlayerPanel', this.handleCurrentSongUpdate.bind(this));
    }
}

export default SongPlayer;

