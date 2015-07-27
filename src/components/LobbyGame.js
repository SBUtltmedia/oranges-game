import React, { PropTypes, Component } from 'react';
import { LINK_COLOR } from '../styles/Themes';
import { Link } from 'react-router';
import _ from 'lodash';
import { joinGame, leaveGame } from '../actions/LobbyActions';
import { startGame, deleteGame } from '../actions/AdminActions';
import { authId } from '../model';

const styles = {
    container: {
        color: 'black',
        marginTop: 16,
    },
    row: {
        display: 'flex'
    },
    section: {
        margin: 10
    },
    link: {
        color: LINK_COLOR,
        margin: 10
    }
};

function gotoGameIfJoinedAndStarted(props) {
    const { game, authId } = props;
    const joinedGame = _.contains(_.keys(game.players), authId);
    if (game.started && joinedGame) {
        window.location.href = `/?#/game/${game.gameId}`;
    }
}

export default class LobbyGame extends Component {
    static propTypes = {
        game: PropTypes.object.isRequired,
        isAdmin: PropTypes.bool
    };

    componentWillMount() {
        gotoGameIfJoinedAndStarted(this.props);
    }

    componentWillReceiveProps(newProps) {
        gotoGameIfJoinedAndStarted(newProps);
    }

    joinGame() {
        const { game } = this.props;
        joinGame(game.gameId);
    }

    leaveGame() {
        const { game } = this.props;
        leaveGame(game.gameId);
    }

    startGame() {
        const { game } = this.props;
        startGame(game.gameId);
    }

    deleteGame() {
        const { game } = this.props;
        deleteGame(game.gameId);
    }

    renderUserButtons() {
        return <div>
            <a style={styles.link} onClick={this.joinGame.bind(this)}>
                Join game
            </a>
            <a style={styles.link} onClick={this.leaveGame.bind(this)}>
                Leave game
            </a>
        </div>;
    }

    renderAdminButtons() {
        return <div>
            <a style={styles.link} onClick={this.startGame.bind(this)}>
                Start game
            </a>
            <a style={styles.link} onClick={this.deleteGame.bind(this)}>
                Delete game
            </a>
        </div>;
    }

    render() {
        const { game, isAdmin } = this.props;
        const { gameId, players, started } = game;
        const backgroundColor = started ? 'lightblue' : 'lightgray';
        return <div style={{ ...styles.container, backgroundColor }}>
            <div style={styles.row}>
                <div style={styles.section}>{gameId}</div>
                <div style={styles.section}>
                    ({_.size(players)}&nbsp;players)
                </div>
                <div style={styles.section}>
                    { isAdmin ? this.renderAdminButtons() : this.renderUserButtons() }
                </div>
            </div>
            <div style={styles.row}>
                <div style={styles.section}>
                    Players joined:&nbsp;
                    { _.map(players, p => p.name).join(', ') }
                </div>
                <div style={styles.section}>
                    <Link to={`/game/${game.gameId}`}>Goto</Link> (for testing)
                </div>
            </div>
        </div>;
    }
}
