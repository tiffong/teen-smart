import React from 'react';
import {View, ScrollView, StyleSheet } from 'react-native';
import SurveyPage from './surveyPage.js';
import { Button } from 'react-native';


export default class GlobalSurvey extends React.Component {
  static navigationOptions = {
    title: 'Survey',
  };

  constructor(props) {
    super(props);
    this.state = {
      questions:  [{question: "Tomaré alcohol el próximo año.",
                     answer: ["No probable del todo", "Poco probable", "Algo probable", "Muy probable"]},

                   {question: "Fumaré cigarrillos dentro de un año",
                    answer : ["No probable del todo", "Poco probable", "Algo probable", "Muy probable"]}



                 ],
      //answer: {},
      currentQuestion: 0
    }


  }

  componentWillReceiveProps(){
    console.log("Location new props")

  }
  nextQuestion() {
    this.setState(previousState => {
      previousState.currentQuestion += 1;
      return previousState;
      }
    );
  }

  prevQuestion() {

  }

  updateAnswer(question, answer) {
    this.setState(previousState => {
      previousState.answer[question] = answer;
      return previousState;
      }
    );
  }

  submit() {

  }
  render() {
    console.log("Hi")
    console.log(this.state.questions[this.state.currentQuestion])
    return (
      <View>
      <SurveyPage nextQuestion={this.nextQuestion.bind(this)}
      prevQuestion={this.prevQuestion.bind(this)}
      updateAnswer={this.updateAnswer}
      submit={this.submit}
      question={this.state.questions[this.state.currentQuestion]}
      style={styles.container}/>

    </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
