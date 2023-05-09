import axios from 'axios';
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ToastAndroid } from "react-native";


export default class SelectSeats extends Component {


    constructor(props) {
        super(props)
        this.state = {
            seatType: [
                {
                    id: 1,
                    name: 'First Class'
                },
                {
                    id: 2,
                    name: 'Business Class'
                },
                {
                    id: 3,
                    name: 'Economy Class'
                }
            ],
            selectedSeatType: this.props.route.params.seatType - 1,
            noOfSeats: "1",
        }
    }

    changeNoOfSeats = (value) => {
        if (parseInt(value) > 5) {
            ToastAndroid.show('you can book 5 seats at a time', ToastAndroid.SHORT)
        } else {
            this.setState({
                noOfSeats: value
            })
        }
    }

    render() {
        console.log("seat", this.props.route.params.seatType);
        return (
            <View style={styles.container}>
                <View style={styles.noOfSeatsContainer}>
                    <Text style={{fontSize: 20,
                    marginBottom: 10}}>Number Of Seats</Text>
                    <TextInput
                        value={this.state.noOfSeats}
                        keyboardType="numeric"
                        style={styles.noOfSeats}
                        onChangeText={this.changeNoOfSeats}
                        editable />
                </View>
                <View style={styles.seatTypeContainer}>
                    <Text style={styles.seatTypeText}>Select Seat Type</Text>
                    {this.state.seatType.length > 0 && (
                        this.state.seatType.map((seat, index) => {
                            return (<TouchableOpacity onPress={() => this.setState({
                                selectedSeatType: (index)
                            })}>
                                <Text style={this.state.selectedSeatType === index ? styles.selectedSeatType : styles.seatType} key={seat.id}>{seat.name}</Text>
                            </TouchableOpacity>)
                        })
                    )}
                </View>

                <TouchableOpacity onPress={() => {
                    this.props.route.params.setNumberOfSeats({
                        id: this.state.seatType[this.state.selectedSeatType].id,
                        noOfSeats: this.state.noOfSeats,
                        typeOfSeat: this.state.seatType[this.state.selectedSeatType].name
                    })
                    this.props.navigation.navigate('Flight')
                }} style={styles.continue}>
                    <Text>Continue</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    noOfSeatsContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },  
    noOfSeats: {
        width: 200,
        borderRadius: 5,
        borderWidth: 2,
        fontSize: 20,
        color: 'black',
        height: 40,
        marginBottom: 10
    },  
    seatTypeContainer: {
        alignItems: 'center'
    },
    seatTypeText: {
        fontWeight: 'bold',
        fontSize: 20
    },
    seatType: {
        backgroundColor: '#ECECEC',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        textAlign: 'center'
    },
    selectedSeatType: {
        backgroundColor: '#2196F3',
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        textAlign: 'center'
    },
    continue: {
        marginTop: 10,
        backgroundColor: 'pink',
        padding: 10,
        borderRadius: 5
    }
})
