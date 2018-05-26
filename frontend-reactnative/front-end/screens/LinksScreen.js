import React from 'react';
import {View, ScrollView, StyleSheet } from 'react-native';
import { ExpoLinksView } from '@expo/samples';


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
    return (
      <View>
      <ScrollView style={styles.container}>

      </ScrollView>


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
