import React, { PropTypes, Component } from 'react';
import { areaTheme, verticalCenter } from '../styles/Themes';
import model from '../model';
import { subscribeToFirebaseObject, getFbRef } from '../utils';

const styles = {
  container: {
      ...areaTheme,
      backgroundColor: 'lightgreen',
      width: 200
  },
  inner: {
      paddingLeft: 50,
      textAlign: 'left'
  },
  value: {
    fontWeight: 'bold'
  }
};

function getFitnessChangeColor(change) {
    if (change > 0) {
      return 'green';
    }
    else if (change < 0) {
      return 'red';
    }
    else {
      return 'black';
    }
}

function formatChange(change) {
    if (change > 0) {
      return '+' + change;
    }
    else {
      return change;
    }
}

export default class Stats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stats: {
                day: null,
                fitness: null,
                fitnessChange: null
            }
        };
    }

    componentWillMount() {
        const { gameId, authId } = model;
        const url = `/games/${gameId}/players/${authId}`;
        this.firebaseRef = getFbRef(url);
        subscribeToFirebaseObject(this, this.firebaseRef, 'stats');
    }

    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const { day, fitness, fitnessChange } = this.state.stats;
        var fitnessChangeColor = getFitnessChangeColor(fitnessChange);

        return <div style={styles.container}>
            <br />
            <h4>Your stats</h4>
            <br /><br />
            <div style={styles.inner}>
                <p>
                    <span>Day:</span>
                    &nbsp;
                    <span style={styles.value}>{day}</span>
                </p>
                <p>
                    <span>Fitness:</span>
                    &nbsp;
                    <span style={styles.value}>{fitness}</span>
                </p>
                <p>
                    <span>Change:</span>
                    &nbsp;
                    <span style={{...styles.value, color: fitnessChangeColor}}>
                                    {formatChange(fitnessChange)}
                    </span>
                </p>
                <p>
                    <span>Loans:</span>
                    <ul>
                        <li>John: <span style={styles.value}>3</span></li>
                    </ul>
                </p>
            </div>
        </div>;
    }
}
