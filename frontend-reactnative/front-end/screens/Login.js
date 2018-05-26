import { AuthSession } from 'expo';
import React from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import jwtDecoder from 'jwt-decode';

/*
  You need to swap out the Auth0 client id and domain with
  the one from your Auth0 client.
  In your Auth0 clent, you need to also add a url to your authorized redirect urls.
  For this application, I added https://auth.expo.io/@community/auth0-example because
  I am signed in as the "community" account on Expo and the slug for this app is "auth0-example".
  You can open this app in the Expo client and check your logs for "Redirect URL (add this to Auth0)"
  to see what URL to add if the above is confusing.
  If you use Facebook through Auth0, be sure to follow this guide: https://auth0.com/docs/connections/social/facebook
*/

var credentials = require('./auth0-credentials');
const auth0ClientId = credentials.clientId;
const auth0Domain = credentials.domain;

  /**
   * Converts an object to a query string.
   */
function toQueryString(params) {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: undefined,
      profile: undefined,
      webServer: 'http://'+credentials.address+':3000',
    };
    this.checkState();
  }


  checkState = async () => {
    try {
      const value = await AsyncStorage.getItem('@Login:key');
      if (value !== null){
      // We have data!!
        console.log(value);
        this.setState(previousState => {
          return { username: value };
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  logout = async () => {
    try{
    this.setState(previousState => {
      return {username: undefined};
    });
    await AsyncStorage.removeItem('@Login:key');
    } catch (error) {
      console.log("Error Clearing Data")
      console.log(error)
    }
  }

  _loginWithAuth0 = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    console.log(`Redirect URL (add this to Auth0): ${redirectUrl}`);

    loginParams = {
        audience: auth0Domain+'/userinfo',
        client_id: auth0ClientId,
        response_type: 'token',
        scope: 'openid profile',
        redirect_uri: redirectUrl,
      }
    console.log(loginParams) 
    const result = await AuthSession.startAsync({
      authUrl: `${auth0Domain}/authorize` + toQueryString(loginParams),
    });

    console.log(result);
    if (result.type === 'success') {
      this.handleParams(result.params);
    }
  }

  handleParams = async (responseObj) => {
    if (responseObj.error) {
      Alert.alert('Error', responseObj.error_description
        || 'something went wrong while logging in');
      return;
    }
    const encodedToken = responseObj.access_token;

    {/*getting profile information from backend*/}
    var details = {
        'token': encodedToken,
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    var request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Bearer '+encodedToken,
      },
      body: formBody
    }

    console.log(request);

    try{

    let response = await fetch("https://teensmart.auth0.com/userinfo", request); 
    let responseData = await response.json();
    console.log(responseData);

    this.setState(previousState => {
      return { username: responseData.name };
    });

	try {
	  await AsyncStorage.setItem('@Login:key', responseData.sub);
	} catch (error) {
	  // Error saving data
	}

    }catch (error) { console.log(error);}

  }

  render() {
    return (
      <View style={styles.container}>


        {this.state.username !== undefined ?
          <View>
            <Text style={styles.title}>Hi {this.state.username}!</Text> 
            <Button title="Logout" onPress={this.logout} />
          </View>
          :
          <View>
            <Text style={styles.title}>Click to Login</Text>
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