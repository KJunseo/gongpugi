import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import * as Permissions from 'expo-permissions';

const Footer = props => {

    return (
        <View style={styles.buttoncontainer}>
            <View style={styles.button}>
                <Button title="qr scanner" onPress={() => {
                    Permissions.askAsync(
                        Permissions.CAMERA
                    )
                        .then(res => {

                            if (res.status === 'granted') {
                                
                                props.navigate('Barcode', { id: props.id });

                                /*if(contactId === ''){
                                  Contacts.addContactAsync({
                                    [Contacts.Fields.FirstName]: 'Bird',
                                    [Contacts.Fields.LastName]: 'Man',
                                    [Contacts.Fields.Company]: 'Young Money',
                                  }).then(id => {
                                    setContactId(id);
                                    Contacts.presentFormAsync(contactId)
                                    .catch((err)=>{
                                      alert(err);
                                    });
                                  })
                                  .catch(err => {
                                    alert(err);
                                  })
                                }
                                else{
                                  Contacts.presentFormAsync(contactId)
                                    .catch((err)=>{
                                      alert(err);
                                    })
                                }*/


                            }
                            else {
                                alert('Hey! You have not enabled camera permissions!');
                            }
                        })
                        .catch(err => {
                            alert(err);
                        })
                }} />
            </View>
            <View style={styles.button}>
                <Button title="home" onPress={() => {
                    props.navigate('Home');
                }} />
            </View>
            <View style={styles.button}>
                <Button title="history" onPress={() => {
                    props.navigate('History', { id: props.id });
                }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttoncontainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    button: {
        flex: 1
    }
});

export default Footer;