import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import BarcodeScreen from './screens/BarcodeScreen';
import HistoryScreen from './screens/HistoryScreen';

const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Barcode: { screen: BarcodeScreen },
  History: { screen: HistoryScreen },
}, {
  cardStyle: {
    backgroundColor: 'transparent',
    opacity: 1,
  },
  transitionConfig: () => ({
    containerStyle: {
      backgroundColor: 'transparent',
    },
  })
});

const App = createAppContainer(MainNavigator);

export default App;


