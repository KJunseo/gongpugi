import React, { Component } from 'react';
import { View, Button, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Dimensions } from "react-native";

var width = Dimensions.get('window').width;

const dbh = firebase.firestore();

export default class LoginScreen extends Component {
    static navigationOptions = {
        title: '로그인',
        headerLeft: null,
        gesturesEnabled: false,
    };

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.getBasicProfile().getId()) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    onSignIn = (googleUser) => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
                // Build Firebase credential with the Google ID token.
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken
                );
                // Sign in with credential from the Google user.
                firebase.auth().signInWithCredential(credential)
                    .then(function (result) {
                        alert(result.additionalUserInfo.profile.name + '님 로그인 되었습니다!');

                        if (result.additionalUserInfo.isNewUser) {
                            /*firebase.database().ref('/users/' + result.user.uid).set({
                                name: result.additionalUserInfo.profile.name,
                                email: result.additionalUserInfo.profile.email,
                                created_at: new Date().toString()
                            });*/
                            dbh.collection("users").doc(result.user.uid).set({
                                name: result.additionalUserInfo.profile.name,
                                email: result.additionalUserInfo.profile.email,
                                created_at: new Date().toString()
                            });
                        }
                        else {
                            /*firebase.database().ref('/users/' + result.user.uid).update({
                                last_logged_in: new Date().toString()
                            });*/
                            dbh.collection("users").doc(result.user.uid).update({
                                last_logged_in: new Date().toString()
                            });
                        }

                        this.props.navigation.navigate('Home');
                    }.bind(this))
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        // ...
                        console.log(error);
                    });
            } else {
                console.log('User already signed-in Firebase.');
            }
        }.bind(this));
    }

    signInWithGoogleAsync = async () => {
        try {
            const result = await Google.logInAsync({
                androidClientId: '524852590242-3och23qlg467vrr5elg6rfono47k4po3.apps.googleusercontent.com',
                iosClientId: '524852590242-gvd92v0f7iqv6rd466i6in4b8j7gpem1.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {
                console.log("success");
                this.onSignIn(result);
                return result.accessToken;
            } else {
                console.log("failed")
                return { cancelled: true };
            }
        } catch (e) {
            console.log(e);
            return { error: true };
        }
    }

    async loginWithFacebook() {
        const { type, token } = await Facebook.logInWithReadPermissionsAsync
            ('430913454291366', { permissions: ['public_profile'] });

        if (type == 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token);

            firebase.auth().signInWithCredential(credential)
                .then(function (result) {
                    alert(result.additionalUserInfo.profile.name + '님 로그인 되었습니다!');

                    if (result.additionalUserInfo.isNewUser) {
                        /*firebase.database().ref('/users/' + result.user.uid).set({
                            name: result.additionalUserInfo.profile.name,
                            email: result.user.email,
                            created_at: new Date().toString()
                        });*/
                        dbh.collection("users").doc(result.user.uid).set({
                            name: result.additionalUserInfo.profile.name,
                            email: result.user.email,
                            created_at: new Date().toString()
                        });
                    }
                    else {
                        /*firebase.database().ref('/users/' + result.user.uid).update({
                            last_logged_in: new Date().toString()
                        });*/
                        dbh.collection("users").doc(result.user.uid).update({
                            last_logged_in: new Date().toString()
                        });
                    }

                    this.props.navigation.navigate('Home');
                }.bind(this))
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    render() {
        const { navigation } = this.props;

        return (
            <ImageBackground source={require('../assets/background.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => this.signInWithGoogleAsync()}
                    >
                        <Image
                            style={styles.loginButton}
                            source={require('../assets/googleLogin.jpg')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.loginWithFacebook()}
                    >
                        <Image
                            style={styles.loginButton}
                            source={require('../assets/fbLogin.jpg')}
                        />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginButton: {
        margin: 3,
        width: width * 0.8,
        resizeMode: 'contain'
    }
});