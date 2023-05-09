import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import React, { Component } from 'react'
import moment from "moment";
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import AnimatedLoader from "react-native-animated-loader";
import EvilIcons from "react-native-vector-icons/EvilIcons";

export default class Profile extends Component {


    constructor() {
        super()

        this.state = {
            user: {},
            bookings: [],
            loading: true,
        }
    }

    handleLogout = () => {
        AsyncStorage.multiRemove(['access_token', 'userData'])
            .then(() => {
                this.props.navigation.navigate('Home')
            }).catch(console.log)
    }

    componentDidMount() {

        AsyncStorage.getItem('userData')
            .then(value => {
                this.setState({
                    user: JSON.parse(value)
                }, () => {
                    axios.post('https://makemytripbackend.herokuapp.com/flight/bookingWithUserId', {
                        userId: this.state.user.id
                    }).then((response) => {
                        console.log(response);
                        this.setState({
                            bookings: response.data.data,
                            loading: false
                        })
                    }).catch((e) => {
                        console.log("error", e.response.data);
                        this.setState({
                            loading: false
                        })
                    })
                })
            }).catch(console.log)
    }


    getTime(time) {
        const formateTime = new Date(time.split('.')[0])
        return moment(formateTime).format('HH:mm')
    }

    getDuration(departureTime, arrivalTime) {
        const start = moment(new Date(departureTime.split('.')[0]))
        const end = moment(new Date(arrivalTime.split('.')[0]))
        const duration = end.diff(start)
        const finalTime = moment.utc(duration).format("HH:mm")
        const hours = finalTime.split(':')[0];
        const minutes = finalTime.split(':')[1];
        return `${hours}h ${minutes}m`
    }

    refreshBookings = () => {
        this.setState({
            loading: true
        })
        axios.post('https://makemytripbackend.herokuapp.com/flight/bookingWithUserId', {
            userId: this.state.user.id
        }).then((response) => {
            console.log(response);
            this.setState({
                bookings: response.data.data,
                loading: false
            })
        }).catch(() => {
            this.setState({
                loading: false
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.profile}>
                    <Image
                        style={styles.image}
                        source={require('../assets/icons/user.png')}
                    />
                    <Text style={styles.userText}>Email: {this.state.user.email}</Text>
                </View>
                <AnimatedLoader
                    visible={this.state.loading}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require('../assets/icons/loader.json')}
                    animationStyle={styles.lottie}
                    speed={1}
                />
                <TouchableOpacity style={styles.logout} onPress={this.handleLogout} >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
                <ScrollView style={styles.bookingConatiner}>
                    <View style={styles.bookingHead}>
                        <Text style={styles.bookingText}>Bookings</Text>
                        <EvilIcons name="refresh" color="#2196F3" size={30} onPress={this.refreshBookings} />
                    </View>
                    {this.state.bookings.length > 0 ? (
                        this.state.bookings.map(booking => {
                            return (
                                <View key={booking.id} style={styles.bookings}>
                                    <View style={styles.airline}>
                                        <Image
                                            style={styles.airlineLogo}
                                            source={{
                                                uri: booking.flight.airline.url
                                            }}
                                        />
                                        <Text>{booking.flight.airline.name}</Text>
                                    </View>
                                    <View style={styles.flightDetailsText}>
                                        <View>
                                            <Text style={styles.text}>{this.getTime(booking.flight.departAt)}</Text>
                                            <Text style={styles.subText}>depart at</Text>
                                        </View>
                                        <View>
                                            <Text>{this.getDuration(booking.flight.departAt, booking.flight.arriveAt)}</Text>
                                            <Text style={styles.subText}>duration</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.text}>{this.getTime(booking.flight.arriveAt)}</Text>
                                            <Text style={styles.subText}>arrive at</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.text}>{'\u20A8 '}{booking.flight.price}</Text>
                                            <Text style={styles.subText}>price</Text>
                                        </View>
                                    </View>
                                </View>)
                        })
                    ) : <Text style={{ textAlign: 'center', color: 'orange' }}>No, Bookings yet</Text>}
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profile: {
        alignItems: 'center',
        marginBottom: 10
    },
    lottie: {
        width: 100,
        height: 100
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 250,
        marginBottom: 5
    },
    userText: {
        padding: 10,
        backgroundColor: '#ECECEC',
        borderRadius: 10,
        fontWeight: 'bold'
    },
    logout: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5
    },
    logoutText: {
        color: 'white'
    },
    bookingHead: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bookingConatiner: {
        backgroundColor: '#ECECEC',
        padding: 10,
        borderRadius: 10,
        width: '90%'
    },
    bookingText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 20,
    },
    bookings: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    airline: {
        flexDirection: 'row',
        marginBottom: 10
    },
    airlineLogo: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    flightDetailsText: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    text: {
        fontWeight: 'bold'
    },
    subText: {
        color: '#F5DEB3',
        fontWeight: 'bold'
    },
})
