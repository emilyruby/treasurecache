import React, { Component } from 'react';
import moment   from 'moment';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  View,
  Button,
  DeviceEventEmitter
} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import {url} from './secret.js';

const TIME_FORMAT = 'MM/DD/YYYY HH:mm:ss';

const fetchAll = (updateChallenges) => {
  fetch(url)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {
          console.log(data);
          updateChallenges(data)
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error', err);
    });
}

export default class reactNativeBeaconExample extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Welcome to Queen Elizabeth Park!',
      challenges: []
    };
  }

  finishedGame = async () => {
    //TODO
    // if (this.state.activeChallenge) {
    //   await Beacons.stopRangingBeaconsInRegion('REGION1', this.activeChallenge.BeaconIDs[0])      
    // }
    this.setState({name: 'You Solved the Game!', activeChallenge: null});
  }

  activateChallenge = async (newChallenge) => {
    await Beacons
      .startRangingBeaconsInRegion(
        'IBeacons',
        newChallenge.BeaconIDs[0]
      )      
    this.setState({ name: newChallenge.ChallengeName, challenges: this.state.challenges, activeChallenge: newChallenge, nextChallenge: this.state.nextChallenge + 1 })
  }

  updateChallenges = (challenges) => {
    console.log(this.state)
    this.setState({ name: this.state.name, challenges: challenges, nextChallenge: 0 })
    console.log("LMAO")
    this.activateChallenge(challenges[0])
  }

  solvedChallenge = () => {
    if (this.state.nextChallenge >= this.state.challenges.length) {
      this.finishedGame()
      return
    }

    this.activateChallenge(this.state.challenges[this.state.nextChallenge])
  }

  handleRange = (data) => {
    console.log(data);
    for (var i = 0; i < data.beacons.length; i++) {
      if (this.state.activeChallenge && data.beacons[i].uuid === this.state.activeChallenge.BeaconIDs[0]) {
        this.solvedChallenge();
      }
    }
  }

  componentWillMount() {
    
    fetchAll(this.updateChallenges)
    Beacons.detectIBeacons();

  }

  componentDidMount() {
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      this.handleRange
    );
  }

  componentWillUnMount(){
    this.beaconsDidRange = null;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.banner}>
          TreasureCache
        </Text>
        <Text style={styles.challengeNumber}>
          {this.state.activeChallenge ? 'Challenge '.concat(this.state.nextChallenge) : ''}
        </Text>
        <Text style={styles.challengeTitle}t>
          {this.state.name}
        </Text>
        <Text style={styles.riddle}>
          {this.state.activeChallenge ? this.state.activeChallenge.RiddleText : ''}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    height: 70,
    backgroundColor: '#ffa987',
    width: '100%',
    fontSize: 40,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 10,
    color: 'black'
  },
  challengeNumber: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: 26,
    color: 'black',
    padding: 6
  },
  challengeTitle: {
    fontSize: 35,
    fontStyle: 'italic',
    color: '#ffa987',
    padding: 15,
    textAlign: 'center'
  },
  riddle: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    padding: 2
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  btleConnectionStatus: {
    paddingTop: 20
  },
  headline: {
    fontSize: 20,
    paddingTop: 20
  }
});

AppRegistry.registerComponent(
  'reactNativeBeaconExample',
  () => reactNativeBeaconExample
);