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
            updateAnswer: this.props.updateAnswer
        }
    }

    componentWillReceiveProps(props){
        this.setState(previousState => {
                previousState.question = props.question["question"];
                previousState.answer = props.question["answer"];
                return previousState;
            }
        );
    }
    renderNextQuestion(){
        if (this.props.lastquestion) {
            return (<TouchableOpacity
                        onPress={this.props.nextQuestion}
                        underlayColor="gray">
                        <Text> Submit </Text>
                    </TouchableOpacity>);
        }
        return(
            <TouchableOpacity
                onPress={this.props.nextQuestion}
                underlayColor="gray">
                <Text> Next Question </Text>
            </TouchableOpacity>
        );
    }

    renderLastQuestion(){
        if (this.props.firstquestion) return "";
        return(
            <TouchableOpacity
                onPress={this.props.prevQuestion}
                underlayColor="gray">
                <Text> Last Question </Text>
            </TouchableOpacity>
        );
    }


    render() {
        console.log('Holocene');
        console.log(this.props.selectedAnswer);
        console.log('Part from me');
        return (

            <View>
                <Text> {this.state.question} </Text>
                <CustomMultiPicker
                    options={this.state.answer}
                    search={false} // should show search bar?
                    multiple={false} //
                    placeholder={"Search"}
                    placeholderTextColor={'#757575'}
                    returnValue={"label"} // label or value
                    callback={(res)=> {this.state.updateAnswer(this.state.question,res)}} // callback, array of selected items
                    rowBackgroundColor={"#eee"}
                    rowHeight={40}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    iconSize={30}
                    selectedIconName={"ios-checkmark-circle-outline"}
                    unselectedIconName={"ios-radio-button-off-outline"}
                    scrollViewHeight={240}
                    selected={this.props.selectedAnswer} // list of options which are selected by default
                />
                <View>
                    {this.renderLastQuestion()}
                    {this.renderNextQuestion()}
                </View>


            </View>
        );
    }
}
