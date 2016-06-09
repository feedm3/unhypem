/**
 * @author Fabian Dietenberger
 */

'use strict';
import React from 'react';
import SongTable from './song-table';
import WelcomeInfoEntry from './welcome-info-entry';
import ShortcutsInfoEntry from './shortcuts-info-entry';
import songDispatcher from '../../dispatcher/song-dispatcher';
import ACTION from '../../constants/action';
import moment from 'moment/min/moment.min';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            timestamp: ''
        };
    }

    handleAllSongsUpdate(songsInfo) {
        this.setState({
            songs: songsInfo.songs,
            timestamp: songsInfo.timestamp
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.timestamp !== this.state.timestamp;
    }

    render() {
        const { timestamp, songs } = this.state;

        return (
            <div className='row'>
                <div className='col-md-3 col-md-push-9'>
                    <WelcomeInfoEntry timestamp={moment(timestamp).fromNow()}/>
                    <ShortcutsInfoEntry/>
                </div>
                <div className='col-md-9 col-md-pull-3'>
                    <SongTable songs={songs} />
                </div>
            </div>
        );
    }

    componentDidMount() {
        songDispatcher.registerOnAllSongsUpdate('Home', this.handleAllSongsUpdate.bind(this));
        songDispatcher.dispatch(ACTION.GET_ALL_SONGS);
    }

    componentWillUnmount() {
        songDispatcher.removeOnALlSongsUpdate('Home');
    }
}
