import React, { Component } from 'react';
import CustomMultiPicker from "react-native-multiple-select-list";

import {
  Image,
  AppRegistry,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Button,
  AsyncStorage,
} from 'react-native';

import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

import { StackNavigator } from 'react-navigation';

export default class HomeScreen extends React.Component {
  constructor(props) {
  super(props)
  this.state = { count: 0 }
}

  static navigationOptions = {
    header: null,
  };

  checkState = async (loc) => {
    try {
      const value = await AsyncStorage.getItem('@Username:key');
      if (value !== null){
      // We have data!!
        console.log(value);
        this.props.navigation.navigate('Survey', {survey: loc})
      } else {
        console.log("Not logged in");
        this.props.navigation.navigate('Profile')
      }
    } catch (error) {
        return false;
        this.props.navigation.navigate('Profile')
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.developmentModeText}> Bienvenido </Text>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/joven.png')
                  : require('../assets/images/joven.png')
              }
              style={styles.welcomeImage}
            />
          </View>
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>VIVE TU JUVENTUD. CUIDA TU SALUD. </Text>

            <Text style={styles.description}>Obten una mejor experiencia al llenar las siguientes encuestas:. </Text>
          </View>

          <TouchableOpacity
            style={styles.firstButton}
            onPress={() => this.checkState('Perfil de Riesgo')}
            underlayColor="gray"
          >
            <Text> Primera Encuesta </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.firstButton}
            onPress={() => this.checkState('Perfil de Salud')}
          >
            <Text> Segunda Encuesta </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.firstButton}
            onPress={() => this.checkState('Perfil de Protección')}
          >
            <Text> Tercera Encuesta </Text>
          </TouchableOpacity>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    return (
      <Text style={styles.developmentModeText}>
        Bienvenido
      </Text>
    );
  }
}

const styles = StyleSheet.create({

  firstButton: {
      alignItems: 'center',
      marginBottom: 40,
      padding: 20,
      width: 250,
      backgroundColor: '#ee8424',
      borderRadius: 5
    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 30
  },
  firstButton: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    width: 250,
    backgroundColor: '#ee8424',
    borderRadius: 5
  },
  developmentModeText: {
    marginTop: 10,
    fontSize: 25,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 25,
    textAlign: 'center',
  },
  description: {
    marginTop: 30,
    marginBottom: 20,
    color: 'grey',
    fontSize: 13,
    lineHeight: 13,
    textAlign: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginTop: 1,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 25,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },

});
