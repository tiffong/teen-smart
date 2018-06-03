import React from 'react';
import {View, ScrollView, StyleSheet } from 'react-native';
import SurveyPage from './surveyPage.js';
import { Button, Text, AsyncStorage } from 'react-native';


var credentials = require('./auth0-credentials');
const auth0ClientId = credentials.clientId;
const auth0Domain = credentials.domain;
var webServer = 'http://'+credentials.address+':3000'


export default class GlobalSurvey extends React.Component {
    static navigationOptions = {
        title: 'Survey',
    };

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            questions:  [],
            //answer: [{"Tomaré alcohol el próximo año." : "Muy probable" }],
            answer: {},
            currentQuestion: 0,
            loading: true,
            submitted: false,
            id: "empty",
        }


    }

    componentDidMount = async () =>{
      this.setState({loading:true});
      await this.getData();
      this.setState({loading:false});      
    }

    setID = async () => {
      const value = await AsyncStorage.getItem('@Login:key');
      this.setState({id:value});
    }

    getData = async () => {
      
      this.setID();

      const { navigation } = this.props;
      const surveyVal = JSON.stringify(navigation.getParam('survey', 'undefined'));

      this.setState({title:surveyVal});

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
  
      try{
      let response = await fetch(webServer + "/getSurvey", request); 
      let responseData = await response.json();
      surveyData = responseData;
      questionsHolder = [];
      for (var i = 0; i<surveyData.questions.length; i++)
      {
        questionsHolder = questionsHolder.concat(surveyData.questions[i].subsection);
      }
      }catch (error) { console.log(error);}
      this.setState({questions:questionsHolder});      
      console.log("Data downloaded");
    }



    nextQuestion() {
        let nextQuestionIndex = this.state.currentQuestion;
        if (this.state.currentQuestion < (this.state.questions.length-1)){
            nextQuestionIndex += 1;
        }
        this.setState(previousState => {
                previousState.currentQuestion = nextQuestionIndex;
                return previousState;
            }
        );
    }

    prevQuestion() {
        let lastQuestionIndex = this.state.currentQuestion;
        if (this.state.currentQuestion > 0){
            lastQuestionIndex -= 1;
        }
        this.setState(previousState => {
                previousState.currentQuestion = lastQuestionIndex;
                return previousState;
            }
        );
    }

    updateAnswer(question, answer) {
        console.log("Update Answer");
        console.log(question);
        console.log(answer);
        this.setState(previousState => {
                previousState.answer[question] = answer[0];
                console.log(previousState);
                return previousState;
            }
        );
        console.log("Update Answer End");
    }

    submit() {
      console.log("Submit");
      console.log(this.state.answer);

      {/*getting profile information from backend*/}
      var details = {
          'user': this.state.id,
          'answers':JSON.stringify(this.state.answer)
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
          fetch(webServer + "/sendData", request); 
      }catch (error) { console.log(error);}
 
      this.setState({answer:{}, questions: [], loading:true, currentQuestion:0});
      this.props.navigation.navigate('Home');
    }

    render() {

      const { navigation } = this.props;
      const surveyVal = JSON.stringify(navigation.getParam('survey', 'undefined'));

      if (this.state.title !== surveyVal) {console.disableYellowBox = true; this.setState({loading:true}); this.componentDidMount();}
      console.log(this.state.loading);
      if (this.state.loading === false) {
        let lastquestion = false;
        let firstquestion = false;
        if (this.state.currentQuestion === this.state.questions.length-1) {
            lastquestion = true;
        }

        if (this.state.currentQuestion === 0) {
            firstquestion = true;
        }

        let question = this.state.questions[this.state.currentQuestion].question;
        let selectedAnswer = ""
        if(question in this.state.answer){
            selectedAnswer =  this.state.answer[question];
        }
        return (
            <View>
              <SurveyPage nextQuestion={this.nextQuestion.bind(this)}
                          prevQuestion={this.prevQuestion.bind(this)}
                          updateAnswer={this.updateAnswer.bind(this)}
                          submit={this.submit.bind(this)}
                          question={this.state.questions[this.state.currentQuestion]}
                          style={styles.container}
                          lastquestion={lastquestion}
                          firstquestion={firstquestion}
                          selectedAnswer={selectedAnswer}
              />
            </View>

        );
      } else {
        return(<View><Text>No data currently available</Text></View>);
      }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
});
