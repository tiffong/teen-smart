import Auth0 from 'react-native-auth0';
import React from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';


var credentials = require('./auth0-credentials');
const auth0ClientId = credentials.clientId;
const auth0Domain = credentials.domain;

const auth0 = new Auth0({domain: auth0Domain, clientId: auth0ClientId});



export default class App extends React.Component {
  state = {
    username: undefined,
    profile: undefined,
    webServer: 'http://'+credentials.address+':3000',
  };

  _loginWithAuth0 = async () => {
    auth0
    .webAuth
    .authorize({scope: 'openid profile email', audience: 'https://teensmart/userinfo'})
    .then(credentials =>
      console.log(credentials)
      // Successfully authenticated
      // Store the accessToken
    )
    .catch(error => console.log(error));
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.username !== undefined ?
          <Text style={styles.title}>Hi {this.state.username}!</Text> :
          <View>
            <Text style={styles.title}>Example: Auth0 login</Text>
            <Button title="Login with Auth0" onPress={this._loginWithAuth0} />
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
});