import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Flight from './Flight';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchCity from './SearchCity';
import FlightResults from './FlightResults';
import SelectSeats from './SelectSeats';
import Booking from './Booking';


const HomeStack = createStackNavigator();

class HomeScreens extends Component {


    async componentDidMount() {
        try{
            const token = await AsyncStorage.getItem('access_token')

            if(token === null) {
                this.props.navigation.navigate('Auth');
            }
        } catch(e) {
            console.log("error", e);
        }
    }

    render() {
        return (
            <HomeStack.Navigator>
                <HomeStack.Screen name="Flight" component={Flight} />
                <HomeStack.Screen name="SearchCity" options={{
                    title: 'Search City'
                }} component={SearchCity} />
                <HomeStack.Screen name="FlightResults" options={{
                    title: 'Flight Result'
                }} component={FlightResults} />
                <HomeStack.Screen name="SelectSeats" options={{
                    title: 'Select Seats'
                }} component={SelectSeats} />
                <HomeStack.Screen name="Booking" options={{
                    title: 'Booking'
                }} component={Booking} />
            </HomeStack.Navigator>
        );
    }

}

export default HomeScreens