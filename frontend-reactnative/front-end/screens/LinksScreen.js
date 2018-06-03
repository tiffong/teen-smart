import React from 'react';
import {View, ScrollView, StyleSheet, Text } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

var credentials = require('./auth0-credentials');
const auth0ClientId = credentials.clientId;
const auth0Domain = credentials.domain;
var webServer = 'http://'+credentials.address+':3000'

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Surveys',
  };

  constructor(props) {
    super(props);

    this.state = {
      surveyName: undefined,
      surveyCts: undefined,
    };
    this.getSurveyData();
  }

  getSurveyData = async() => {
    const { navigation } = this.props;
    const surveyVal = JSON.stringify(navigation.getParam('survey', undefined));

    {/*getting profile information from backend*/}
    var details = {
        'sName': surveyVal,
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

    console.log(request);
    try{
    let response = await fetch(webServer + "/getSurvey", request); 
    let responseData = await response.json();
    surveyData = responseData;
    }catch (error) { console.log(error);}

    this.setState(previousState => {
      return {surveyName:surveyVal, surveyCts: surveyData };
    });
    console.log(this.state);
  }

  fillData(){
    var returnView = [];
    
    //for each category
    this.state.surveyCts.questions.forEach(function (tmp) {
        returnView.push(
            <View style={styles.survey}><Text>{tmp.category}</Text></View>
        )

        tmp.subsection.forEach(function (tmp2) {
            returnView.push(
                <View>
                <View style={styles.survey}><Text>{tmp2.question}</Text></View>
{/**                <MultipleChoice
                    options={tmp2.answers}
                    maxSelectedOptions={1}
                /> **/}
                </View>
            )
        }.bind(this));
    }.bind(this));
    return(returnView);
  }
  render() {

    return (
      <View>
      {this.state.surveyCts == undefined ?
          <ScrollView style={styles.container}>
            <View style={styles.survey}><Text>No survey data currently available</Text></View>
          </ScrollView>
      :
          <ScrollView style={styles.container}>
            <View style={styles.surveyTitle}><Text style={styles.title}>Survey: {this.state.surveyCts.title.trim().replace(/"/g,"")}</Text></View>
            {this.fillData()}
          </ScrollView>
      }
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  surveyTitle: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  survey: {
    flexDirection: 'row',
    padding: 5,
  },
  category: {
    fontSize: 15,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
});
