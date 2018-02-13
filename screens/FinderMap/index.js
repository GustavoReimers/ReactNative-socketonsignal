import React, { Component } from "react"
import { View, Image, Text, TouchableOpacity, StyleSheet, TextInput, ImageBackground, style, StatusBar, ScrollView } from "react-native"
import MapView from 'react-native-maps';
import global from '../global';
import TimerMixin from 'react-timer-mixin';
import Geocoder from 'react-native-geocoding';

Geocoder.setApiKey('AIzaSyDBFraqhAhu1R6XVpQ7Ij4N-S-RF7G51v4');

class Welcome extends Component {

    constructor(props) {
        super(props)
        this.state = {
            address: "",
            phoneNumber: "",
            latMobile: -1000,
            latWeb: -1000,
            longMobile: -1000,
            longWeb: -1000,
            latDelta: 300,
            longDelta: 300,
            error: null
        }
        this.updateLocation = this.updateLocation.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.updateDisabled = this.updateDisabled.bind(this);
    }

    componentDidMount() {
        TimerMixin.setInterval(this.getLocation, 1000);
        const self = this;
        global.socket.on("locationUpdateFromWeb", function (data) {
            // alert(data.phone)
            self.setState({
                latWeb: data.lat,
                longWeb: data.long,
                phoneNumber: data.phone,
            })
            if (data.lat != -1000 && data.long != -1000) {
                Geocoder.getFromLatLng(data.lat, data.long).then(res => {
                    self.setState({
                        address: res.results[0].address_components[0].long_name
                    })
                }).catch(err => console.log(err))
            }
        });
    }
    getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latMobile: position.coords.latitude,
                    longMobile: position.coords.longitude,
                    error: null,
                });
                this.updateLocation()

            },
            (error) => this.updateDisabled(),
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
        );
    }
    goBack() {
        this.props.navigation.goBack()
    }

    goMap() {
        this.props.navigation.navigate('MapScreen')
    }
    updateDisabled() {
        global.socket.emit("mobileDisabled", global.strID);
    }
    updateLocation() {
        global.socket.emit("mobileConnected", this.state.latMobile, this.state.longMobile, global.strID);
    }

    render() {
        return (

            <View style={{ flex: 1 }}>
                {((this.state.latMobile != -1000 && this.state.longMobile != -1000) || (this.state.latWeb != -1000 && !!this.state.longWeb != -1000))
                    &&
                    <MapView style={styles.map}
                        initialRegion={{
                            latitude: this.state.latMobile,
                            longitude: this.state.longMobile,
                            latitudeDelta: this.state.latDelta,
                            longitudeDelta: this.state.longDelta
                        }}>

                        {this.state.latMobile != -1000 && this.state.longMobile != -1000 && <MapView.Marker
                            image={require("../../icon.png")}
                            coordinate={{ "latitude": this.state.latMobile, "longitude": this.state.longMobile }}
                        />}

                        {this.state.latWeb != -1000 && !!this.state.longWeb != -1000 && <MapView.Marker
                            image={require("../../icon.png")}
                            coordinate={{ "latitude": this.state.latWeb, "longitude": this.state.longWeb }}
                        />}

                    </MapView>
                }
                <View >
                    <Text >Finders number</Text>
                    <Text >{this.state.phoneNumber}</Text>
                    <Text >{this.state.address}</Text>
                </View>
                <View >
                    <TouchableOpacity  >
                        <Text >Not reunited</Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Text >Reuinted</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});
export default Welcome
