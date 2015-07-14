import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'redux/react';

const styles = {
    container: {
        color: 'white',
        backgroundColor: 'darkgray'
    },
};

@connect(state => ({
    playerName: state.player.name
}))
export default class LobbyGames extends Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        playerName: PropTypes.string.isRequired
    };

    render() {
        const { playerName } = this.props;
        return <div styles={[styles.container]}>
            <div>Player name: {playerName}</div>
        </div>;
    }
}
