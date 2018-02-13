import React, { Component } from "react"
import { Platform, View, Image, Text, TouchableOpacity, TextInput, ImageBackground, StatusBar, ScrollView } from "react-native"
import openSocket from 'socket.io-client';
import global from '../global';
const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
        'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

class Welcome extends Component {
    constructor(props) {
        super(props)
        this.goMissing = this.goMissing.bind(this);
    }
    componentDidMount() {
        global.endPoint  = "http://192.168.80.129";
        global.strID = "12345";
        global.socket = openSocket(global.endPoint);
        const self = this;
        global.socket.emit("mobileOn", global.strID);
        global.socket.on("searchPhone", function (data) {
            self.goMissing();
        });
    }
    goMissing() {
        this.props.navigation.navigate('MichaelMissingScreen')
    }

    render() {
        return (
            <View >
                <Text>
                    Welcome to React Native!!!
            </Text>
                <Text >
                    To get started, edit App.js
            </Text>
                <Text >
                    {instructions}
                </Text>
                <TouchableOpacity onPress={this.goMissing.bind(this)}>
                    <Text >GotoMap</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default Welcome
