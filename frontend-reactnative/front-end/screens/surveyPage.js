import React from 'react';
import {
    TouchableOpacity,
    Button,
    Text,
    View,
    ScrollView,
    StyleSheet

} from 'react-native';

import CustomMultiPicker from "react-native-multiple-select-list";

export default class SurveyPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            question: this.props.question["question"],
            answer: this.props.question["answer"],
            currAnswer: this.props.selectedAnswer,
            updateAnswer: this.props.updateAnswer,
        }
    }

    componentWillReceiveProps(props){
        this.setState(previousState => {
                previousState.question = props.question["question"];
                previousState.answer = props.question["answer"];
                previousState.currAnswer = props.selectedAnswer;
                return previousState;
            }
        );
    }
    renderNextQuestion(){
        if (this.props.lastquestion) {
            return (<View><TouchableOpacity
                        style = {styles.submitButton}
                        onPress={this.props.submit}
                        underlayColor="gray">
                        <Text style={styles.buttonText}> Submit </Text>
                    </TouchableOpacity></View>
            );
        }
        return(
            <View><TouchableOpacity
                style={styles.bottomButton}
                onPress={this.props.nextQuestion}
                underlayColor="gray">
                <Text style={styles.buttonText}> Next Question </Text>
            </TouchableOpacity></View>
        );
    }

    renderLastQuestion(){
        if (this.props.firstquestion) return(<View></View>);
        return(
            <View><TouchableOpacity
                style = {styles.bottomButton}
                onPress={this.props.prevQuestion}
                underlayColor="gray">
                <Text style={styles.buttonText}> Last Question </Text>
            </TouchableOpacity></View>
        );
    }


    render() {
        console.log(this.state.currAnswer);
        return (

            <View>
                <Text style={styles.question}> {this.state.question} </Text>
                <CustomMultiPicker
                    options={this.state.answer}
                    search={false}
                    multiple={false}
                    placeholder={"Search"}
                    placeholderTextColor={'#757575'}
                    returnValue={"label"}
                    callback={(res)=> {this.state.updateAnswer(this.state.question,res)}}
                    rowBackgroundColor={"#eee"}
                    rowHeight={40}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    iconSize={30}
                    selectedIconName={"ios-checkmark-circle-outline"}
                    unselectedIconName={"ios-radio-button-off-outline"}
                    scrollViewHeight={240}
                    selected={this.state.currAnswer}
                />
                <View>
                    {this.renderLastQuestion()}
                    {this.renderNextQuestion()}
                </View>


            </View>
        );
    }
}

const styles = StyleSheet.create({
  question: {
    color: '#21497e',
    fontSize: 18,
    marginTop: 5,
  },
  bottomButton: {
    alignItems: 'center',
    padding: 20,
    width: 250,
    backgroundColor:  '#d91b5c',
    borderRadius: 20,
    marginLeft: 65,
    marginBottom: 10,
    },
    submitButton:{
      alignItems: 'center',
      padding: 20,
      width: 250,
      backgroundColor: '#ee8424',
      borderRadius: 20,
      marginLeft: 65,
      marginBottom: 10,
    },
    buttonText: {
      color: 'white',
    },
});