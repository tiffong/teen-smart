import React, { Component } from 'react';
import { AppRegistry} from 'react-native';
import CustomMultiPicker from "react-native-multiple-select-list";

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

class Greeting extends Component {
  render() {
    return (
      <Text>Hola, {this.props.name}!</Text>

    );
  }
}

const userList = {
  "123":"Muy Buenas",
  "124":"Buenas",
  "125":"Malas",
  "126": "Muy Malas"
}

const question2 = {
  "123":"Nunca",
  "124":"Rara vez",
  "125":"A menudo",
  "126": "Siempre"
}

export default class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>

        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
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
            {this._maybeRenderDevelopmentModeWarning()}

//MY CODE STARTS HERE


            <TouchableOpacity
                    style={styles.firstButton}
                    onPress={() =>  this.props.navigation.navigate('Survey')}
                    underlayColor="gray"
                  >
                    <Text> Perfil de Salud </Text>
            </TouchableOpacity>

        <TouchableOpacity
                style={styles.firstButton}
                onPress={() =>  this.props.navigation.navigate('Survey')}
                underlayColor="gray"
              >
                <Text> Perfil de Proteccion </Text>
        </TouchableOpacity>


          </View>

        </ScrollView>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
Sitio web de Joven Salud
        </Text>
      );

      //MY CODE HERE
      return (
        <View>

        <Text style={styles.developmentModeText}>
          {learnMoreButton}
        </Text>
        </View>
      );

    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://jovensalud.net/web/index.jsp');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
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
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 300,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
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
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
