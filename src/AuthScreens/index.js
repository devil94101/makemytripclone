import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Login';

const AuthStack = createStackNavigator();

class AuthScreens extends Component {

    render() {
        return (
            <AuthStack.Navigator>
                <AuthStack.Screen name="Login" component={Login} options={{title: 'Login/Signup'}} />
            </AuthStack.Navigator>
        );
    }

}

export default AuthScreens