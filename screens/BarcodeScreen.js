import React, { Component } from 'react';
import { View, WebView, Button, StyleSheet, Text } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import '@firebase/firestore';
import Footer from '../components/Footer';

const dbh = firebase.firestore();

export default class BarcodeScreen extends Component {
    static navigationOptions = {
        title: '바코드 스캐너',
    };

    render() {
        const { navigate } = this.props.navigation;

        const id = this.props.navigation.getParam('id', "");

        return (
            <View style={styles.container}>
                <BarCodeScanner
                    style={styles.container}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    onBarCodeScanned={(res) => {
                        console.log(res);
                        navigate('Home', { url: res.data });
                        //console.log(res);
                        //console.log(id);

                        /*firebase.database().ref('/users/' + id).once('value')
                            .then(snapshot => {
                                var history = (typeof snapshot.val().history === 'undefined') ? [] : snapshot.val().history;
                                var index = history.findIndex(object => object.data === res.data && object.type === res.type);

                                if (index === -1) {
                                    history.push({
                                        "data": res.data,
                                        "target": res.target,
                                        "type": res.type,
                                        "count": 1,
                                        "date": new Date().toString()//new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                                    });
                                }
                                else {
                                    history[index] = {
                                        "data": res.data,
                                        "target": res.target,
                                        "type": res.type,
                                        "count": history[index].count + 1,
                                        "date": history[index].date
                                    };
                                }

                                firebase.database().ref('users/' + id).update({
                                    history: history
                                });


                            })
                            .catch(err => {
                                alert(err);
                            });*/

                        dbh.collection('users').doc(id).get()
                            .then((doc) => {
                                if (!doc.exists) {
                                    alert('No such document!');
                                } else {
                                    var history = (typeof doc.data().history === 'undefined') ? [] : doc.data().history;
                                    var index = history.findIndex(object => object.data === res.data && object.type === res.type);

                                    if (index === -1) {
                                        history.push({
                                            "data": res.data,
                                            "target": res.target,
                                            "type": res.type,
                                            "count": 1,
                                            "date": new Date().toString()//new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
                                        });
                                    }
                                    else {
                                        history[index] = {
                                            "data": res.data,
                                            "target": res.target,
                                            "type": res.type,
                                            "count": history[index].count + 1,
                                            "date": history[index].date
                                        };
                                    }

                                    dbh.collection("users").doc(id).update({
                                        history: history
                                    });
                                }

                            })
                            .catch((err) => {
                                alert(err);
                            });


                    }}
                />
                <Footer navigate={navigate} id={id} />
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    }
});