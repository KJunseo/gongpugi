import React, { Component } from 'react';
import { View, FlatList, Button, StyleSheet, Text, Picker, ImageBackground } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Card from '../components/Card';
import Footer from '../components/Footer';
import { TouchableOpacity } from 'react-native-gesture-handler';

const dbh = firebase.firestore();

import { Dimensions } from "react-native";

var width = Dimensions.get('window').width;

export default class HistoryScreen extends Component {
    static navigationOptions = {
        title: '히스토리'
    };

    state = {
        history: [],
        sortMode: "old",
        id: this.props.navigation.getParam('id', "")
    };

    componentDidMount() {
        /*firebase.database().ref('/users/' + this.state.id).once('value')
            .then(snapshot => {
                var history = (typeof snapshot.val().history === 'undefined') ? [] : snapshot.val().history;
                this.setState({ history: history });
            })
            .catch(err => {
                alert(err);
            });*/
        dbh.collection('users').doc(this.state.id).get()
            .then((doc) => {
                if (!doc.exists) {
                    alert('No such document!');
                } else {
                    var history = (typeof doc.data().history === 'undefined') ? [] : doc.data().history;
                    this.setState({ history: history });
                }

            })
            .catch((err) => {
                alert(err);
            });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <ImageBackground source={require('../assets/background.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <Picker
                        selectedValue={this.state.sortMode}
                        style={styles.picker}
                        onValueChange={(itemValue, itemIndex) => {
                            if (itemValue === "new") {
                                this.setState({ history: this.state.history.slice(0).sort((a, b) => (Date.parse(a.date) < Date.parse(b.date)) ? 1 : -1), sortMode: "new" });
                            }
                            else if (itemValue === "old") {
                                this.setState({ history: this.state.history.slice(0).sort((a, b) => (Date.parse(a.date) > Date.parse(b.date)) ? 1 : -1), sortMode: "old" });
                            }
                            else if (itemValue === "most") {
                                this.setState({ history: this.state.history.slice(0).sort((a, b) => (a.count < b.count) ? 1 : -1), sortMode: "most" });
                            }
                            else if (itemValue === "least") {
                                this.setState({ history: this.state.history.slice(0).sort((a, b) => (a.count > b.count) ? 1 : -1), sortMode: "least" });
                            }
                        }}>
                        <Picker.Item label="oldest (date)" value="old" />
                        <Picker.Item label="newest (date)" value="new" />
                        <Picker.Item label="most counts" value="most" />
                        <Picker.Item label="least counts" value="least" />
                    </Picker>
                    <FlatList
                        data={this.state.history}
                        renderItem={({ item, index, separators }) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    navigate('Home', { url: item.data });
                                }}>
                                    <Card style={styles.itemContainer}>
                                        <Text>{item.data}</Text>
                                        <Text>횟수: {item.count}</Text>
                                        <Text>날짜: {new Date(item.date).getFullYear() + '.' + (new Date(item.date).getMonth() + 1) + '.' + new Date(item.date).getDate() + ' ' + new Date(item.date).getHours() + ':' + new Date(item.date).getMinutes() + ':' + new Date(item.date).getSeconds()}</Text>
                                    </Card>
                                </TouchableOpacity>
                            );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Footer navigate={navigate} id={this.state.id} />
                </View>
            </ImageBackground>

        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemContainer: {
        width: '100%',
        alignItems: 'center'
    },
    picker: {
        flex: 0.2,
        height: 20,
        width: width * 0.4,
        alignSelf: 'flex-end'
    }
});