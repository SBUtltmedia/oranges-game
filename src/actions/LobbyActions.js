import { USER_AUTHED, JOIN_GAME } from '../constants/ActionTypes';
import { FIREBASE_APP_URL } from '../constants/Settings';
import { trimString } from '../utils';
import Firebase from 'firebase';
import _ from 'lodash';

function isNameAcceptable(name) {
    return trimString(name) !== '';
}

export function loginUser(name) {
    if (isNameAcceptable(name)) {
        const ref = new Firebase(FIREBASE_APP_URL);
        return dispatch => {
            function sendBackResults(authData) {
                //ref.off();
                dispatch({
                    type: USER_AUTHED,
                    userId: authData.uid,
                    name: name
                });
            }
            const auth = ref.getAuth();
            if (auth) {  // if already authorized
                sendBackResults(auth);
            }
            else {
                ref.authAnonymously((error, authData) => {
                    if (authData) {
                        const user = {
                            userId: authData.uid,
                            name: name
                        };
                        ref.child('users').push(user);  // What ID is this key()?
                        sendBackResults(authData);
                    }
                    else {
                        console.error("Client unauthenticated.");
                    }
                });
            }
        };
    }
    else {
        alert(`Unacceptable name: ${name}`);
        window.location.reload();
    }
}

export function joinGame(gameId, userId) {

    console.log("JOIN GAME");

    const ref = new Firebase(`${FIREBASE_APP_URL}/games/${gameId}/users`);
    return dispatch => {
        function sendBackResults(name, userId, playerId) {
            //ref.off();
            dispatch({
                type: JOIN_GAME,
                name: name,
                userId: userId,
                playerId: playerId
            });
        }
        ref.on("value", snapshot => {
            const users = snapshot.val();
            const existingKey = _.findKey(users, p => p.userId === userId);
            if (existingKey) {
                const player = players[existingKey];
                sendBackResults(player.name, player.userId, existingKey);
            }
            else {
                const player = {
                    name: '' + userId,
                    userId: userId,
                    oranges: {
                        box: 0,
                        basket: 0,
                        dish: 0
                    },
                    fitness: 0
                };
                const playerId = ref.push(player).key();
                sendBackResults(player.name, player.userId, playerId);
            }
        });
    };
}
