import React, { Component } from 'react';
import { View, WebView, StyleSheet, Button } from 'react-native';
import * as firebase from 'firebase';
import Footer from '../components/Footer';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBXJEsX5VENwUwLo0HLxIsJXV4XABbTGYQ",
    authDomain: "rn-study.firebaseapp.com",
    databaseURL: "https://rn-study.firebaseio.com/",
    storageBucket: "gs://rn-study.appspot.com",
    projectId: "rn-study"
};

firebase.initializeApp(firebaseConfig);

import {Platform, InteractionManager} from 'react-native';

const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
// Work around issue `Setting a timer for long time`
// see: https://github.com/firebase/firebase-js-sdk/issues/97
    const timerFix = {};
    const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
            InteractionManager.runAfterInteractions(() => {
                if (!timerFix[id]) {
                    return;
                }
                delete timerFix[id];
                fn(...args);
            });
            return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
    };

    global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
            const ttl = Date.now() + time;
            const id = '_lt_' + Object.keys(timerFix).length;
            runTask(id, fn, ttl, args);
            return id;
        }
        return _setTimeout(fn, time, ...args);
    };

    global.clearTimeout = id => {
        if (typeof id === 'string' && id.startsWith('_lt_')) {
            _clearTimeout(timerFix[id]);
            delete timerFix[id];
            return;
        }
        _clearTimeout(id);
    };
}


export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Home',
        headerRight: <Button title="log out" onPress={() => {
            firebase.auth().signOut();
        }} />,
    };

    state = {
        id: ""
    };

    componentDidMount() {
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.navigation.navigate('Login');
            }
            else {
                this.setState({ id: user.uid });
            }
        });
    }

    render() {
        const { navigate }  = this.props.navigation;

        const url = this.props.navigation.getParam('url', 'https://stackoverflow.com/');
        return (
            <View style={styles.container}>
                <WebView
                    useWebKit={true}
                    ref={ref => (this.webview = ref)}
                    source={{ uri: url }}
                    userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36"
                />
                <Footer navigate={navigate} id={this.state.id} />
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});