import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';



import HomeScreens from '../HomeScreens';
import AuthScreens from "../AuthScreens";
import Profile from '../components/Profile';

const Tab = createBottomTabNavigator();

class BottomTabNavigation extends Component {


    constructor() {
        super()
        this.state = {
            showLoginTab: true,
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('access_token')
            .then(value => {
                if(value === null) {
                    this.setState({
                        showLoginTab: true
                    })
                } else {
                    this.setState({
                        showLoginTab: false
                    })
                }
            })
    }

    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="Home"
                    tabBarOptions={{
                        activeTintColor: '#2196F3',
                        tabStyle: {
                            paddingTop: 2.5,
                        },
                        labelStyle: {
                            paddingBottom: 10
                        }
                    }}
                >
                    <Tab.Screen name="Home" 
                        listeners={async ({ navigation }) => {
                            const token = await AsyncStorage.getItem('access_token');
                            if(token === null) {
                                this.setState({
                                    showLoginTab: true
                                })
                                navigation.navigate('Auth')
                            }else {
                                this.setState({
                                    showLoginTab: false
                                })
                            }
                        }}
                        component={HomeScreens} options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }} />
                    {this.state.showLoginTab ? (<Tab.Screen name="Auth" component={AuthScreens} options={{
                        tabBarLabel: 'Login/Signup',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="login" color={color} size={size} />
                        ),
                    }} />): (<Tab.Screen name="Profile" component={Profile} options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign name="profile" color={color} size={size} />
                        ),
                    }} />)}
                </Tab.Navigator>
            </NavigationContainer>
        );
    }
}

export default BottomTabNavigation;