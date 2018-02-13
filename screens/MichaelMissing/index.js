import React, { Component } from "react"
import { View, Image, Text, TouchableOpacity, TextInput, ImageBackground, StatusBar, ScrollView } from "react-native"
import global from '../global'

class Welcome extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
    }

    goBack() {
        global.socket.emit("mobileNo",global.strID);
        this.props.navigation.goBack()
    }

    goMap() {
        global.socket.emit("mobileYes",global.strID);
        this.props.navigation.navigate('MapScreen')
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Text>Is Michael missing?</Text>
                <View >
                    <TouchableOpacity onPress={this.goBack.bind(this)}>
                        <Text >No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.goMap.bind(this)}>
                        <Text >Yes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
export default Welcome
