import { Constants, Permissions, Notifications } from 'expo';
import {AsyncStorage} from 'react-native';

var credentials = require('../screens/auth0-credentials');
const auth0ClientId = credentials.clientId;
const auth0Domain = credentials.domain;
var webServer = 'http://'+credentials.address+':3000'

// Example server, implemented in Rails: https://git.io/vKHKv
const PUSH_ENDPOINT = webServer+'/registerNotifications';

export default (async function registerForPushNotificationsAsync() {
  // Remote notifications do not work in simulators, only on device
  if (!Constants.isDevice) {
    return;
  }

  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  let { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  await AsyncStorage.setItem('@Token:key', token);

  return;
  // POST the token to our backend so we can use it to send pushes from there
{/**  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
    }),
  });
**/}


      {/*getting profile information from backend*/}
{/**
      var details = {
          token: JSON.stringify({
            value: token,
          })
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
          return fetch(PUSH_ENDPOINT, request); 
      }catch (error) { console.log(error);}
**/}

});
