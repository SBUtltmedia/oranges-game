import React, { Component } from 'react';
import StyleSheet from'react-style';
import { Link } from 'react-router';
import { connect } from 'redux/react';
import * as FluxActions from '../actions/FluxActions';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import { getAllGames } from '../gameUtils';

const styles = StyleSheet.create({
    page: {
        textAlign: "center",
        height: '100%'
    }
});

function getPlayersData(firebase, gameId) {

}

function getGamesData(firebase) {
    const games = getAllGames(firebase);
    return _.map(games, (g, i) => `${i + 1},${getPlayersData(firebase, g.id)}`).join('\n');
}

function getData(firebase) {
    return 'Game,Players\n' + getGamesData(firebase);
}

@connect(state => ({
    firebase: state.firebase
}))
export default class Data extends Component {
    componentWillMount() {
        const { dispatch, firebase } = this.props;
        this.fluxActions = bindActionCreators(FluxActions, dispatch);
        this.fluxActions.listenToFirebase();
    }

    componentWillUnmount() {
        this.fluxActions.disconnectFromFirebase();
    }

    render() {
        const { firebase } = this.props;
        const data = getData(firebase);
        return <div styles={[styles.page]}>
            <a download="orange-game_data.csv"
                href={"data:text/csv;charset=utf-8,"+ encodeURI(data)}>Download</a>
        </div>;
    }
}
