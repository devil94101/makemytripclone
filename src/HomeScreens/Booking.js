import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";


class Booking extends Component {


    bookTicket = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('userData'));
        axios.post('https://makemytripbackend.herokuapp.com/flight/booking', {
            flightId: this.props.route.params.flight.id,
            userId: user.id,
            totalCost: this.props.route.params.flight.price
        }).then((response) => {
            const bookedData = response.data;
            const { message } = bookedData;
            ToastAndroid.show(message, ToastAndroid.SHORT)
            this.props.navigation.navigate('Profile')
        })
        .catch((err) => {
            console.log(err.response.data);
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.fromToAddress}>
                    <View style={styles.from}>
                        <Text style={{ fontWeight: 'bold' }}>From</Text>
                        <Text>{this.props.route.params.flight.fromCity}</Text>
                    </View>
                    <AntDesign name="arrowright" size={30} />
                    <View style={styles.to}>
                        <Text style={{ fontWeight: 'bold' }}>To</Text>
                        <Text>{this.props.route.params.flight.toCity}</Text>
                    </View>
                </View>
                <View style={styles.flightDetails}>
                    <View style={styles.flightInfo}>
                        <Text style={styles.flightInfoHead}>Departure At</Text>
                        <Text style={styles.flightInfoTail}>{this.props.route.params.flight.departAt}</Text>
                    </View>
                    <View style={styles.flightInfo}>
                        <Text style={styles.flightInfoHead}>Duration</Text>
                        <Text style={styles.flightInfoTail}>{this.props.route.params.flight.duration}</Text>
                    </View>
                    <View style={styles.flightInfo}>
                        <Text style={styles.flightInfoHead}>Arrival At</Text>
                        <Text style={styles.flightInfoTail}>{this.props.route.params.flight.arriveAt}</Text>
                    </View>
                    <View style={styles.flightInfo}>
                        <Text style={styles.flightInfoHead}>price</Text>
                        <Text style={styles.flightInfoTail}>{'\u20A8 '}{this.props.route.params.flight.price}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.bookingBtn} onPress={this.bookTicket}>
                    <Text>Book</Text>
                </TouchableOpacity>
            </View>
        );
    }


}

export default Booking;


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fromToAddress: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ECECEC',
        padding: 10,
        width: '90%',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 20,
        elevation: 3
    },
    flightDetails: {
        width: '90%',
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10
    },
    flightInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    flightInfoHead: {
        color: 'white'
    },
    flightInfoTail: {
        color: 'orange'
    },
    bookingBtn: {
        backgroundColor: 'orange',
        padding: 10,
        borderRadius: 10
    }
})