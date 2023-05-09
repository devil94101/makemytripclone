import axios from 'axios';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedLoader from "react-native-animated-loader";


class Login extends Component {

    constructor() {
        super()
        this.state = {
            emailOrMobile: null,
            password: '',
            success: true,
            errorMsg: '',
            loading: false,
        }
    }

    emailOrMobileChnage = (emailOrMobile) => {
        this.setState({
            emailOrMobile: emailOrMobile
        })
    }

    passwordChnage = (password) => {
        this.setState({
            password: password
        })
    }

    storeLoginDetails = async (accessToken, data) => {
        try {
            await AsyncStorage.setItem('access_token', accessToken)
            await AsyncStorage.setItem('userData', JSON.stringify(data))
        } catch (e) {
            console.log("error", e);
        }
    }

    handleSubmit = async () => {
        try {
            this.setState({
                loading: true,
            })
            const loginResponse = await axios.post('https://makemytripbackend.herokuapp.com/account/', {
                email: this.state.emailOrMobile,
                password: this.state.password
            })
            console.log(loginResponse);
            const { success, message, accessToken , data} = loginResponse.data
            this.setState({
                errorMsg: '',
                success: success,
                loading: false
            })
            await this.storeLoginDetails(accessToken, data);
            ToastAndroid.show(message, ToastAndroid.SHORT)
            this.props.navigation.navigate('Flight')


        } catch (error) {
            console.log("error", error.response.data);
            const { message, success } = error.response.data
            this.setState({
                errorMsg: message,
                success: success,
                loading: false
            })
        }

    }

    render() {
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Image
                    style={styles.appLogo}
                    source={require('../assets/icons/appLogo.png')}
                />
                <View style={styles.loginWithMobile}>
                    <Text style={styles.loginText}>Use Mobile Or Email to Login/signup</Text>
                    <TextInput
                        editable
                        style={styles.loginInput}
                        value={this.state.emailOrMobile}
                        onChangeText={this.emailOrMobileChnage}
                        placeholder="Enter Mobile Or Email"
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        editable
                        style={styles.loginInput}
                        value={this.state.password}
                        onChangeText={this.passwordChnage}
                        placeholder="Enter Password"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                    />
                    {!this.state.success && <Text style={styles.loginError}>{this.state.errorMsg}</Text>}
                    <AnimatedLoader
                        visible={this.state.loading}
                        overlayColor="rgba(255,255,255,0.75)"
                        source={require('../assets/icons/loader.json')}
                        animationStyle={styles.lottie}
                        speed={1}
                    />
                    <TouchableOpacity style={styles.continue} onPress={this.handleSubmit}>
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    appLogo: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginBottom: 20,
    },
    loginWithMobile: {
        width: "80%"
    },
    loginText: {
        textAlign: 'center',
        marginBottom: 20,
    },
    loginInput: {
        color: 'gray',
        borderColor: '#2196F3',
        borderRadius: 5,
        borderWidth: 2,
        height: 50,
        fontSize: 20,
        marginBottom: 20
    },
    loginError: {
        color: 'red',
        padding: 5
    },
    continue: {
        backgroundColor: '#2196F3',
        padding: 10,
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueText: {
        color: '#fff',
        textTransform: 'uppercase'
    },
    signup: {
        marginTop: 10,
        textAlign: 'center'
    },
    signupScreenLink: {
        color: 'blue',
    }
})

export default Login;