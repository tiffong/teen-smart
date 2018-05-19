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
    console.log("Hi")
    super(props);
    this.state = {
      question: this.props.question["question"],
      answer: this.props.question["answer"]
    }
  }




  render() {
    return (

      <View>
        //You have to connect this to the newscreen (so the answer is updated as need.)
        //Also set up navigation buttons to go back and forward
        //Question 1 Text:
        <Text> {this.state.question} </Text>
        //Question 1
        <CustomMultiPicker
        options={this.state.answer}
        search={false} // should show search bar?
        multiple={false} //
        placeholder={"Search"}
        placeholderTextColor={'#757575'}
        returnValue={"label"} // label or value
        callback={(res)=>{ console.log(res) }} // callback, array of selected items
        rowBackgroundColor={"#eee"}
        rowHeight={40}
        rowRadius={5}
        iconColor={"#00a2dd"}
        iconSize={30}
        selectedIconName={"ios-checkmark-circle-outline"}
        unselectedIconName={"ios-radio-button-off-outline"}
        scrollViewHeight={240}
        selected={[1,2]} // list of options which are selected by default
      />
      <View>
      <TouchableOpacity
              onPress={this.props.nextQuestion}
              underlayColor="gray"
            >
              <Text> Next Q </Text>
      </TouchableOpacity>
      </View>


    </View>
  );
  }
}
