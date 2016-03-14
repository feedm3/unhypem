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

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            songs: [],
            timestamp: ''
        };
    }

    handleAllSongsUpdate(songsInfo) {
        console.log(songsInfo);
        
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
                <div className="col-md-9">
                    <SongTable songs={songs} />
                </div>
                <div className="col-md-3">
                    <WelcomeInfoEntry timestamp={moment(timestamp).fromNow()}/>
                    <ShortcutsInfoEntry />
                </div>
            </div>
        );
    }

    componentDidMount() {
        songDispatcher.registerOnAllSongsUpdate('Home', this.handleAllSongsUpdate.bind(this));
        songDispatcher.dispatch(ACTION.GET_ALL_SONGS);
    }

    componentWillUnmount() {
        console.log('cwu');

        songDispatcher.removeOnALlSongsUpdate('Home');
    }
}

export default Home;
