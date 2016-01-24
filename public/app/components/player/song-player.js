/**
 * @author Fabian Dietenberger
 */

'use strict';

import React from 'react';
import getSongs from '../../api/songs-api';
import PlayButton from './play-button';
import ForwardButton from './forward-button';
import RewindButton from './rewind-button';
import VolumeBar from './volume-bar';
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
                        <div className="player-waveform-container" ng-click="onProgressbarClick($event)">
                            <div className="player-waveform" ng-style="waveformStyle"></div>
                            <uib-progressbar id="progressbar" className="player-progressbar" value="progressInPercent"
                                             max="100" type="info"></uib-progressbar>
                        </div>
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

