import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontistoIcon from "react-native-vector-icons/Fontisto";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

class Flight extends Component {


    constructor() {
        super()
        this.state = {
            active: 0,
            fromDate: new Date(Date.now()),
            returnDate: new Date(Date.now() + (24 * 60 * 60 * 1000)),
            showReturnDatePicker: false,
            showFromDate: false,
            mode: 'date',
            showReturnDate: false,
            fromDetails: {
                id: 1,
                city: 'Nagpur',
                name: 'Dr. Babasaheb Ambedkar International Airport'
            },
            toDetails: {
                id: 2,
                city: 'Mumbai',
                name: 'Chhatrapati Shivaji International Airport'
            },
            seatDetails: {
                id: 1,
                noOfSeats: 1,
                typeOfSeat: 'First Class'
            }
        }
    }

    changeFromDateShow = () => {
        this.setState({
            showFromDate: true
        })
    }

    changeReturnDateShow = () => {
        this.setState({
            showReturnDatePicker: true,
        })
    }

    changeFromDate = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.fromDate;
        this.setState({
            fromDate: currentDate,
            showFromDate: false
        })
    };

    changeReturnDate = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.fromDate;
        this.setState({
            returnDate: currentDate,
            showReturnDatePicker: false
        })
    }

    renderFullDate(date) {
        return moment(date).format('llll').split(' ').slice(0, -2).join(' ');
    }

    changeFromDetails = (fromDetails) => {
        this.setState({
            fromDetails: fromDetails
        })
    }

    changeToDetails = (toDetails) => {
        this.setState({
            toDetails: toDetails
        })
    }

    setReturnDate = () => {
        this.setState({
            active: 1,
            showReturnDate: true
        })
    }

    handleSubmit = () => {
        if (this.state.fromDetails.id === this.state.toDetails.id) {
            ToastAndroid.show('Arrival City and Departure City can not be same', ToastAndroid.SHORT);
            return
        }
        this.props.navigation.navigate('FlightResults', {
            from: this.state.fromDetails.id.toString(),
            to: this.state.toDetails.id.toString(),
            seatTypeId: this.state.seatDetails.id.toString(),
            departAt: moment(this.state.fromDate).format('YYYY-MM-DD'),
            Return: moment(this.state.returnDate).format('YYYY-MM-DD'),
            fromCity: this.state.fromDetails.city,
            toCity: this.state.toDetails.city
        })
    }

    setNumberOfSeats = (seatDetails) => {
        this.setState({
            seatDetails: seatDetails
        })
    }

    swapAddress = () => {
        this.setState({
            fromDetails: this.state.toDetails,
            toDetails: this.state.fromDetails
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.tripType}>
                    <Text
                        style={this.state.active === 0 ? styles.tripTypeTextActive : styles.tripTypeText}
                        onPress={() => { this.setState({ active: 0, showReturnDate: false }) }} >one way</Text>
                    <Text
                        style={this.state.active === 1 ? styles.tripTypeTextActive : styles.tripTypeText}
                        onPress={() => { this.setState({ active: 1, showReturnDate: true }) }}>roundtrip</Text>
                </View>
                <View style={styles.cityField}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('SearchCity', {
                        from: true,
                        changeFromDetails: this.changeFromDetails
                    })}>
                        <View style={styles.icon}>
                            <Icon name="flight-takeoff" size={30} />
                        </View>
                        <View>
                            <Text style={styles.fromOrTo}>FROM</Text>
                            <Text style={styles.cityName}>{this.state.fromDetails.city}</Text>
                            <Text style={styles.airportName}>{this.state.fromDetails.name}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.swap} onPress={this.swapAddress}>
                    <IoniconsIcon name="swap-vertical" color="#2196F3" size={25} />
                </TouchableOpacity>
                <View style={styles.cityField}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('SearchCity', {
                        from: false,
                        changeToDetails: this.changeToDetails
                    })}>
                        <View style={styles.icon}>
                            <Icon name="flight-land" size={30} />
                        </View>
                        <View>
                            <Text style={styles.fromOrTo}>To</Text>
                            <Text style={styles.cityName}>{this.state.toDetails.city}</Text>
                            <Text style={styles.airportName}>{this.state.toDetails.name}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.departure}>
                    <TouchableOpacity onPress={this.changeFromDateShow}>
                        <View style={styles.departureDate}>
                            <View style={styles.icon}>
                                <FontistoIcon name="date" size={30} />
                            </View>
                            <View>
                                <Text style={styles.fromOrTo}>Departure Date</Text>
                                <Text style={styles.date}>{this.renderFullDate(this.state.fromDate)}</Text>
                                {this.state.showFromDate && (<DateTimePicker
                                    testID="dateTimePicker"
                                    value={this.state.fromDate}
                                    mode={this.state.mode}
                                    is24Hour={true}
                                    display="default"
                                    onChange={this.changeFromDate}
                                />)}
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.returnDate}>
                        {!this.state.showReturnDate ? <TouchableOpacity onPress={this.setReturnDate}>
                            <Text style={styles.addreturnDate}>+ Add return date</Text>
                            <Text style={styles.saveMoneyText}>Save more on round trips!</Text></TouchableOpacity>
                            : <TouchableOpacity onPress={this.changeReturnDateShow} style={{ flexDirection: 'row' }}>
                                <View style={styles.icon}>
                                    <FontistoIcon name="date" size={30} />
                                </View>
                                <View>
                                    <Text style={styles.fromOrTo}>Return Date</Text>
                                    <Text style={styles.date}>{this.renderFullDate(this.state.returnDate)}</Text>
                                    {this.state.showReturnDatePicker && (<DateTimePicker
                                        testID="dateTimePicker"
                                        value={this.state.returnDate}
                                        mode={this.state.mode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.changeReturnDate}
                                    />)}
                                </View>
                            </TouchableOpacity>}
                    </View>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('SelectSeats', {
                    setNumberOfSeats: this.setNumberOfSeats,
                    seatType: this.state.seatDetails.id
                })}>
                    <View style={styles.travellers}>
                        <View style={styles.icon}>
                            <IoniconsIcon name="person" size={30} />
                        </View>
                        <View>
                            <Text style={styles.fromOrTo}>Travellers & class</Text>
                            <Text style={styles.cityName}>{this.state.seatDetails.noOfSeats} <Text style={styles.state}>{this.state.seatDetails.typeOfSeat}</Text></Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.search} onPress={this.handleSubmit}>
                    <Text style={styles.searchText}>Search</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    tripType: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 5,
        borderWidth: 1,
        width: '80%',
        padding: 5,
        marginBottom: 20,
    },
    tripTypeText: {
        textTransform: 'uppercase',
        paddingTop: 2.5,
        paddingBottom: 2.5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        color: 'black'
    },
    tripTypeTextActive: {
        textTransform: 'uppercase',
        paddingTop: 2.5,
        paddingBottom: 2.5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        color: 'white',
        backgroundColor: '#2196F3'
    },
    cityField: {
        width: "90%",
        backgroundColor: '#ECECEC',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    swap: {
        position: 'absolute',
        top: 110,
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 5,
        zIndex: 2,
        right: 30
    },
    departure: {
        width: "90%",
        flexDirection: 'row',
        borderRadius: 5,
        marginBottom: 10
    },
    departureDate: {
        backgroundColor: '#ECECEC',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginRight: 2.5
    },
    returnDate: {
        backgroundColor: '#ECECEC',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        flexDirection: 'row'
    },
    date: {
        fontSize: 12
    },
    addreturnDate: {
        color: '#2196F3',
        textAlign: 'center'
    },
    saveMoneyText: {
        fontSize: 12
    },
    travellers: {
        width: "90%",
        backgroundColor: '#ECECEC',
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    search: {
        width: '90%',
        backgroundColor: '#2196F3',
        padding: 10,
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchText: {
        color: '#fff',
        textTransform: 'uppercase'
    },
    icon: {
        marginRight: 10,
        justifyContent: 'center'
    },
    fromOrTo: {
        color: 'gray'
    },
    cityName: {
        fontWeight: 'bold'
    },
    state: {
        color: 'gray',
        fontWeight: 'normal'
    },
    airportName: {
        color: 'gray',
        fontSize: 12
    }
});

export default Flight