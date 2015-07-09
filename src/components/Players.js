import React, { PropTypes, Component } from 'react';
import { areaTheme } from '../styles/Themes';
import Player from './Player';
import _ from 'lodash';
import { connect } from 'redux/react';
import Firebase from 'firebase';
import { FIREBASE_APP_URL } from '../constants/Settings';

const styles = {
    container: {
        ...areaTheme,
        backgroundColor: 'lightblue',
        overflow: 'scroll'
    }
};

@connect(state => ({
    userId: state.player.userId
}))
export default class Players extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            players: []
        };
    }

    // TODO: Consider removing presence stuff
    setupAmOnline() {
      this.amOnline.on('value', function(online) {
          if (online.val()) {
              //this.userRef.onDisconnect().remove();
              this.userRef.set(true);
          }
          else {
              // User left
          }
        }.bind(this));
    }

    componentWillMount() {
        const { userId, actions } = this.props;
        const { players } = this.state;

        actions.joinGame(userId);

        this.firebaseRef = new Firebase(`${FIREBASE_APP_URL}/players`);

        // TODO: Consider removing presence stuff
        this.amOnline = new Firebase(`${FIREBASE_APP_URL}/.info/connected`);
        this.userRef = new Firebase(`${FIREBASE_APP_URL}/presence/${userId}`);

        this.firebaseRef.on("child_added", function(dataSnapshot) {
            this.setState({
                players: players.concat([dataSnapshot.val()])
            });
        }.bind(this));

        this.firebaseRef.on("value", function(snapshot) {
            this.setState({
                players: _.values(snapshot.val())
            });
            this.setupAmOnline();
        }.bind(this));
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { players } = this.state;
        return <div style={styles.container}>
            { _.map(players, (p, i) => <Player key={i} name={p.name} />) }
        </div>;
    }
}
