import { StyleSheet, Text, View,SafeAreaView, TextInput,Pressable} from 'react-native';
import React from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { colors } from '../constants/colors';
import { useState } from 'react';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
type ThemeType = keyof typeof Colors;

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};
const Feedback = ({navigation}:Props) => {

    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [feedback,setFeedback]=useState("");
  const { theme } = useTheme();

  const feedbackStyles = styling(theme);

  const handleSubmitFeedback=()=>{
    fetch("https://product-tracker-api-production.up.railway.app/api/feedback",{
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        firstName:firstName,
        lastName:lastName,
        feedback:feedback
        }),
    })
  }
  return (
    <SafeAreaView style={feedbackStyles.container}>
     <View style={feedbackStyles.centered}>
     <Text style={feedbackStyles.appTitle}>Feedback</Text>
      <View>
        <Text style={feedbackStyles.feedbackFormLabel}>First Name</Text>
        <TextInput style={feedbackStyles.feedbackFormInput} onChangeText={firstName=>setFirstName(firstName)} value={firstName}/>
        <Text style={feedbackStyles.feedbackFormLabel}>Last Name</Text>
        <TextInput style={feedbackStyles.feedbackFormInput} onChangeText={lastName=>setLastName(lastName)} value={lastName}/>
        <Text style={feedbackStyles.feedbackFormLabel}>Feedback</Text>
        <TextInput style={feedbackStyles.feedbackFormInputTextArea} onChangeText={feedback=>setFeedback(feedback)} value={feedback}/>
      </View>
      <View>
        <Pressable style={feedbackStyles.loginButton} onPress={handleSubmitFeedback}>
          <Text style={feedbackStyles.loginButtonText}>Submit</Text>
        </Pressable>
        <Pressable style={feedbackStyles.goBackButton} onPress={()=>navigation.navigate("Settings")}>
          <Text style={feedbackStyles.loginButtonText}>Go Back</Text>
        </Pressable>
      </View>
     </View>
    </SafeAreaView>
  );
};

export default Feedback;

const styling = (theme: ThemeType) =>
  StyleSheet.create({
     container: {
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: Colors[theme]?.backgroundColor,
        },
    appTitle: {
      fontSize: 35,
      textAlign: 'center',
      fontFamily: 'BebasNeue-Regular',
      color: colors.purple, // Assuming you want to keep the static color for now.
    },
    feedbackFormLabel:{
       fontSize: 16,
            fontFamily: 'Lato-Italic',
            color: Colors[theme]?.textColor,
            marginBottom: 10,
             textAlign:'center'
    },
    feedbackFormInput:{
        color: Colors[theme]?.textColor,
            width: 200,
            marginBottom: 20,
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: colors.purple,
           
    },
    feedbackFormInputTextArea:{
      color: Colors[theme]?.textColor,
          width: 200,
          height:200,
          marginBottom: 20,
          borderRadius: 8,
          padding: 8,
          borderWidth: 1,
          borderColor: colors.purple,
         
  },
    centered:{
      alignItems:"center"
    },
    loginButton: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    loginButtonText: {
      textAlign: 'center',
      fontSize: 15,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    goBackButton: {
      backgroundColor: colors.pink,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
  });
