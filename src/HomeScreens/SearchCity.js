import axios from 'axios'
import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default class SearchCity extends Component {

    constructor() {
        super()
        this.state = {
            searchText: '',
            lists: [],
            filteredLists: [],
            hideLists: false,
        }
    }

    changeSearchText = (value) => {
        console.log(value.toLowerCase());
        const filteredLists = this.state.lists.filter(list => {
            return (list.name.toLowerCase().includes(value.toLowerCase()) || list.city.toLowerCase().includes(value.toLowerCase()))
        }
        )
        console.log(filteredLists);
        this.setState({
            searchText: value,
            filteredLists: filteredLists,
            hideLists: true
        })
    }

    async componentDidMount() {
        try {
            console.log("yes")
            const nameAndCity = await axios.get('https://makemytripbackend.herokuapp.com/flight/nameandcity');
            console.log(nameAndCity);
            const lists = nameAndCity.data.data;
            this.setState({
                lists: lists
            })
        } catch (e) {
            console.log("error", e);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    onChangeText={this.changeSearchText}
                    value={this.state.searchText}
                    style={styles.search}
                    editable />
                {this.state.filteredLists.length > 0 && this.state.filteredLists.map(list => {
                    return (
                        <View key={list.id} style={styles.list}>
                            <TouchableOpacity onPress={() => {
                                if (this.props.route.params.from) {
                                    this.props.route.params.changeFromDetails({
                                        id: list.id,
                                        city: list.city,
                                        name: list.name,
                                    })
                                } else {
                                    this.props.route.params.changeToDetails({
                                        id: list.id,
                                        name: list.name,
                                        city: list.city
                                    })
                                }
                                this.props.navigation.navigate('Flight')
                            }}>
                                <Text style={styles.name}>{list.name}</Text>
                                <Text>{list.city}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
                {!this.state.hideLists && this.state.lists.map(list => {
                    return (
                        <View key={list.id} style={styles.list}>
                            <TouchableOpacity onPress={() => {
                                if (this.props.route.params.from) {
                                    this.props.route.params.changeFromDetails({
                                        id: list.id,
                                        name: list.name,
                                        city: list.city
                                    })
                                } else {
                                    this.props.route.params.changeToDetails({
                                        id: list.id,
                                        name: list.name,
                                        city: list.city
                                    })
                                }
                                this.props.navigation.navigate('Flight')
                            }}>
                                <Text style={styles.name}>{list.name}</Text>
                                <Text>{list.city}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    search: {
        width: '90%',
        borderRadius: 5,
        borderWidth: 2,
        fontSize: 20,
        color: 'black',
        height: 40
    },
    list: {
        backgroundColor: '#ECECEC',
        padding: 10,
        width: '90%'
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold'
    }
})