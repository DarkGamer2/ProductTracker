import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';

const Scanner = () => {
  return (
    <View>
      <Text style={scannerStyles.screenTitle}>Scanner</Text>
      <Text style={scannerStyles.text}>The requested feature will be coming soon in a future update :)</Text>
    </View>
  );
};

export default Scanner;

const scannerStyles = StyleSheet.create({
  screenTitle:{
    fontSize: 35,
    textAlign: 'center',
    margin: 20,
    color:colors.purple,
    fontFamily:"BebasNeue-Regular",
  },
  text:{
    fontFamily:"Lato-Italic",
    fontSize:15,
    color:colors.black
  }
});
