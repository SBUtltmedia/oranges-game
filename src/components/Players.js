import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import Player from './Player';
import _ from 'lodash';
import { connect } from 'redux/react';
import Firebase from 'firebase';
import { subscribeToFirebaseList, getFbRef } from '../utils';

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
        overflow: 'scroll'
    }
};

@connect(state => ({
    authId: state.user.authId
}))
export default class Players extends Component {
    static propTypes = {
        authId: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        gameId: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    }

    componentWillMount() {
        const { gameId } = this.props;
        this.firebaseRef = getFbRef(`/games/${gameId}/players`);
        subscribeToFirebaseList(this, this.firebaseRef, 'players');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { players } = this.state;
        return <div style={styles.container}>
            { _.map(players, (p, i) => <Player key={i} {...p} />) }
        </div>;
    }
}
