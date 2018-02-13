/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import OneSignal from 'react-native-onesignal';

import MapScreen from './screens/FinderMap'
import MichaelMissingScreen from './screens/MichaelMissing'
import MainScreen from './screens/MainScreen'

const AppNavigator = StackNavigator({
  MainScreen: { screen: MainScreen },
  MapScreen: { screen: MapScreen },
  MichaelMissingScreen: { screen: MichaelMissingScreen },

}, {
    initialRouteName: 'MainScreen',
  });

export default class App extends Component {
  constructor(props) {
    super(props)
    this.onReceived = this.onReceived.bind(this)
    this.onOpened = this.onOpened.bind(this)
    this.onRegistered = this.onRegistered.bind(this)
    this.onIds = this.onIds.bind(this)
  }

  componentWillMount() {
    alert("Mount1")
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onRegistered(notifData) {
    alert("Device had been registered for push notifications!", notifData);
  }

  onIds(device) {
    alert('Device info: ', device);
  }

  render() {
    return (
      <AppNavigator />
    );
  }
}
