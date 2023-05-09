import axios from 'axios';
import moment from 'moment';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedLoader from 'react-native-animated-loader';

class FlightResults extends Component {
  constructor() {
    super();
    this.state = {
      flightResults: [],

      noDataFound: false,

      loading: true,
    };
  }

  componentDidMount() {
    axios
      .post('https://makemytripbackend.herokuapp.com/flight/search', {
        from: this.props.route.params.from,
        to: this.props.route.params.to,
        seatTypeId: this.props.route.params.seatTypeId,
        departAt: this.props.route.params.departAt,
        Return: this.props.route.params.Return,
      })
      .then(response => {
        console.log(response);

        const flights = [];

        response.data.data.forEach(flight => {
          if (!flights.includes(flight.airline.name)) {
            flights.push(flight.airline.name);
          }
        });

        if (response.data.data.length === 0) {
          this.setState({
            noDataFound: true,
            loading: false,
          });
        } else {
          this.setState({
            flightResults: response.data.data,
            sortedResults: response.data.data,
            noDataFound: false,
            loading: false,
            flights: flights,
          });
        }
      })
      .catch(console.log);
  }

  getTime(time) {
    const formateTime = new Date(time.split('.')[0]);
    return moment(formateTime).format('HH:mm');
  }

  getDuration(departureTime, arrivalTime) {
    const start = moment(new Date(departureTime.split('.')[0]));
    const end = moment(new Date(arrivalTime.split('.')[0]));
    const duration = end.diff(start);
    const finalTime = moment.utc(duration).format('HH:mm');
    const hours = finalTime.split(':')[0];
    const minutes = finalTime.split(':')[1];
    return `${hours}h ${minutes}m`;
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: this.state.noDataFound ? 'white' : '#AFEEEE'},
        ]}>
        <View style={styles.fromToAddress}>
          <View style={styles.details}>
            <Text style={{fontWeight: 'bold'}}>From</Text>
            <Text style={styles.city}>{this.props.route.params.fromCity}</Text>
          </View>
          <AntDesign name="arrowright" size={30} />
          <View style={styles.details}>
            <Text style={{fontWeight: 'bold'}}>To</Text>
            <Text style={styles.city}>{this.props.route.params.toCity}</Text>
          </View>
        </View>
        <AnimatedLoader
          visible={this.state.loading}
          overlayColor="rgba(255,255,255,0.75)"
          source={require('../assets/icons/loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />

        <ScrollView style={styles.flight}>
          {this.state.flightResults.length > 0 &&
            this.state.flightResults.map(flight => {
              return (
                <TouchableOpacity
                  key={flight.id}
                  style={styles.flightDetails}
                  onPress={() => {
                    this.props.navigation.navigate('Booking', {
                      airline: flight.airline,
                      flight: {
                        id: flight.id,
                        departAt: this.getTime(flight.departAt),
                        arriveAt: this.getTime(flight.arriveAt),
                        duration: this.getDuration(
                          flight.departAt,
                          flight.arriveAt,
                        ),
                        price: flight.price,
                        noOfStop:
                          flight.noOfStop === 0
                            ? 'Non Stop'
                            : `${flight.noOfStop} ${
                                flight.noOfStop > 1 ? 'Stops' : 'Stop'
                              }`,
                        from: this.props.route.params.from,
                        to: this.props.route.params.to,
                        fromCity: this.props.route.params.fromCity,
                        toCity: this.props.route.params.toCity,
                        seatTypeId: this.props.route.params.seatTypeId,
                      },
                    });
                  }}>
                  <View style={styles.airlineName}>
                    <View style={styles.airlineImage}>
                      <Image
                        style={styles.airlineLogo}
                        source={{
                          uri: flight.airline.url,
                          height: 20,
                          width: 20,
                        }}
                      />
                      <Text>{flight.airline.name}</Text>
                      <Text style={styles.noOfStops}>
                        {flight.noOfStop === 0
                          ? 'Non Stop'
                          : `${flight.noOfStop} ${
                              flight.noOfStop > 1 ? 'Stops' : 'Stop'
                            }`}
                      </Text>
                    </View>
                    <Text style={styles.bookBtn}>Book</Text>
                  </View>
                  <View style={styles.flightDetailsText}>
                    <View>
                      <Text style={styles.text}>
                        {this.getTime(flight.departAt)}
                      </Text>
                      <Text style={styles.subText}>depart at</Text>
                    </View>
                    <View>
                      <Text>
                        {this.getDuration(flight.departAt, flight.arriveAt)}
                      </Text>
                      <Text style={styles.subText}>duration</Text>
                    </View>
                    <View>
                      <Text style={styles.text}>
                        {this.getTime(flight.arriveAt)}
                      </Text>
                      <Text style={styles.subText}>arrive at</Text>
                    </View>
                    <View>
                      <Text style={styles.text}>
                        {'\u20A8 '}
                        {flight.price}
                      </Text>
                      <Text style={styles.subText}>price</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
        {this.state.noDataFound && (
          <View style={styles.noDataFound}>
            <MaterialCommunityIcons
              name="information-outline"
              color="orange"
              size={60}
            />
            <Text style={styles.noDataFoundText}>Sorry, no route found</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    elevation: 3,
  },
  city: {
    color: 'black',
  },
  lottie: {
    width: 100,
    height: 100,
  },
  bookBtn: {
    padding: 5,
    borderRadius: 5,
    color: 'white',
    backgroundColor: '#2196F3',
  },
  airlineName: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  airlineLogo: {
    marginRight: 10,
  },
  airlineImage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noOfStops: {
    marginLeft: 10,
  },
  flight: {
    width: '95%',
  },
  flightDetails: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    elevation: 5,
  },
  flightDetailsText: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
  },
  subText: {
    color: '#F5DEB3',
    fontWeight: 'bold',
  },
  noDataFound: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  noDataFoundText: {
    color: 'orange',
  },
  filterResults: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '90%',
  },
  showAll: {
    height: 40,
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default FlightResults;
