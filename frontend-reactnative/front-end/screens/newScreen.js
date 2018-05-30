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
            //answer: [{"Tomaré alcohol el próximo año." : "Muy probable" }],
            answer: {},
            currentQuestion: 0
        }


    }

    componentDidMount(){
      //get the survey database
      //spinner till then
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
        this.setState(previousState => {
                previousState.answer[question] = answer[0];
                return previousState;
            }
        );
    }

    submit() {

    }
    render() {
        let lastquestion = false;
        let firstquestion = false;
        if (this.state.currentQuestion === this.state.questions.length-1) {
            lastquestion = true;
        }

        if (this.state.currentQuestion === 0) {
            firstquestion = true;
        }
        let question = this.state.questions[this.state.currentQuestion].question;
        console.log('Dividerr');
        console.log(question);
        let selectedAnswer = ""
        if(question in this.state.answer){
            console.log('Question in answer');
            selectedAnswer =  this.state.answer[question];
        }
        console.log('location');
        console.log(this.state.answer)
        console.log(selectedAnswer)
        return (
            <View>
              <SurveyPage nextQuestion={this.nextQuestion.bind(this)}
                          prevQuestion={this.prevQuestion.bind(this)}
                          updateAnswer={this.updateAnswer.bind(this)}
                          submit={this.submit}
                          question={this.state.questions[this.state.currentQuestion]}
                          style={styles.container}
                          lastquestion={lastquestion}
                          firstquestion={firstquestion}
                          selectedAnswer={selectedAnswer}
              />
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
