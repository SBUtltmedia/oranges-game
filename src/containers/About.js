import React from "react/addons";
import StyleSheet from'react-style';
import { Link } from 'react-router';

const styles = StyleSheet.create({
    page: {
        margin: 'auto',
        fontSize: 14,
        width: 400,
        height: '100%'
    },
    label: {
        float: "left",
        textAlign: "right",
        marginRight: 8,
        width: 100
    }
});

export default class About {
    render() {
        return <div styles={[styles.page]}>
            <p>
                <div styles={[styles.label]}>Github:</div>
                <a href="https://github.com/SBUtltmedia/orange-game">
                    SBUtltmedia/orange-game
                </a>
            </p>
            <p>
                <div styles={[styles.label]}>forked from:</div>
                <a href="https://github.com/kenfehling/isomorphic-react-example/tree/es6-flux-redux-jest">
                    kenfehling/isomorphic-react-example
                </a>
            </p>
        </div>;
    }
}
