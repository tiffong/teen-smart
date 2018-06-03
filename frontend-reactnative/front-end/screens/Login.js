import { AuthSession } from 'expo';
import React from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Image,
  TouchableOpacity,
} from 'react-native';
import jwtDecoder from 'jwt-decode';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


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
var webServer = 'http://'+credentials.address+':3000'


/** This is for the raidio buttons*/
var radio_props = [
  {label: '1 vez por semana', value: 0 },
  {label: '2 veces por semana', value: 1 },
  {label: '3 o más veces por semana', value: 2 }

];



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
      picture: undefined,
      webServer: 'http://'+credentials.address+':3000',
    };
    this.checkState();
  }


  checkState = async () => {
    try {
      const value = await AsyncStorage.getItem('@Username:key');
      const value2 = await AsyncStorage.getItem('@Profile:key');
      const value3 = await AsyncStorage.getItem('@Picture:key');
      if (value !== null){
      // We have data!!
        console.log(value);
        this.setState(previousState => {
          return { username: value, profile:value2, picture:value3 };
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  logout = async () => {
    try{
    this.setState(previousState => {
      return {username: undefined, profile: undefined, picture: undefined};
    });
    await AsyncStorage.removeItem('@Login:key');
    await AsyncStorage.removeItem('@Username:key');
    await AsyncStorage.removeItem('@Picture:key');
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
  
  uploadNotif = async(value)  =>{
      console.log("Uploading Notif Pref")
      var profileHldr = await AsyncStorage.getItem('@Login:key');
      var token = await AsyncStorage.getItem('@Token:key');
      {/*getting profile information from backend*/}
      console.log(profileHldr);
      var details = {
          'id': profileHldr,
          'times':value+1,
          'token':token,
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
        },
        body: formBody
      };
  
      try{
          fetch(webServer + "/uploadNotif", request); 
      }catch (error) { console.log(error);}
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
      return { username: responseData.name, profile:responseData.sub, picture:responseData.picture };
    });

	try {
	  await AsyncStorage.setItem('@Login:key', responseData.sub);
	  await AsyncStorage.setItem('@Username:key', responseData.name);
	  await AsyncStorage.setItem('@Picture:key', responseData.picture);
	} catch (error) {
	  // Error saving data
	}

    }catch (error) { console.log(error);}

  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.username !== undefined ?
          <View style={styles.main}>
            <Image
            source={{uri:this.state.picture}}
            style={styles.picture}
            />
            <Text style={styles.name}> {this.state.username} </Text>
            <Text style={styles.titulo}>  Preferencias de notificaciones push  </Text>
            <Text style={styles.text}> Mejora tu salud al activar las notificaciones Push que te ayudarán a ser la mejor versión de ti mismo. </Text>
            <RadioForm
              style={styles.radioButton}
              radio_props={radio_props}
              initial={0}
              onPress={(value) => {this.uploadNotif(value)}}
            />
            <TouchableOpacity
              style={styles.firstButton}
              onPress={this.logout}
              underlayColor="gray"
            >
            <Text style ={styles.buttonText}> Logout </Text>
            </TouchableOpacity>
          </View> 
           :
          <View>
            <Text style={styles.title}>Bienvenido a</Text>
            <Image
              source={require('../assets/images/joven.png')}
              style={styles.welcomeImage}
            />
            <TouchableOpacity
              style={styles.firstButton}
              onPress={this._loginWithAuth0}
              underlayColor="gray"
            >
            <Text style ={styles.buttonText}> Iniciar Sessión </Text>
            </TouchableOpacity>
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
    marginTop: 10,
    fontSize: 35,
    color: 'gray',
    lineHeight: 35,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 15,
  },
  firstButton: {
      alignItems: 'center',
      marginBottom: 40,
      padding: 20,
      width: 250,
      backgroundColor: '#d91b5c',
      borderRadius: 5,
      marginLeft: 20,
      marginTop: 15
    },
  buttonText: {
    color: 'white',
  },
  welcomeImage: {
    width: 300,
    height: 120,
    resizeMode: 'contain',
    marginTop: 1,
    marginLeft:40,
    marginLeft: -10,
  },
  name:{
    marginTop: 10,
    fontSize: 35,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 35,
  },
  picture: {
    marginTop: 30,
    marginBottom: 10,
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  main:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo:{
    marginTop: 23,
    fontSize: 20,
    color: 'white',
    backgroundColor:'#d91b5c',
    lineHeight: 35,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  text:{
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 17,
    color: '#ee8424',
    lineHeight: 17,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  radioButton:{
    marginTop: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});