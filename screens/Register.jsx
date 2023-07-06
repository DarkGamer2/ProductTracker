import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View,ActivityIndicator } from 'react-native'
import React from 'react'
import PTLogo from "../assets/images/ProductTrackerIcon.png";
import { colors } from '../constants/colors';
import { useState } from 'react';
const Register = ({navigation}) => {
    const [firstName,setFirstName]=useState('');
    const [lastName,setLastName]=useState('');
    const [email,setEmail]=useState('');
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [registerButtonText,setRegisterButtonText]=useState('Register');
    const [registerButtonColor,setRegisterButtonColor]=useState('#7b00ff')
    const Account={firstName,lastName,email,username,password};
    const handleRegister=()=>{
        fetch('#',{
            method: 'POST',
            "contentType": 'application/json',
            credentials:true,
            body:JSON.stringify(Account),
        },setRegisterButtonText(
            <Text>
                <ActivityIndicator size={'small'} color={colors.white}/>
                Creating Account...
            </Text>
        ),
        setRegisterButtonColor('#00c438')
        )
    }

    const closeRegScreen=()=>{
        navigation.navigate("Login")
    }
    return (
   <ScrollView>
    <View>
        <Image style={registerStyles.PTLogoStyle} source={PTLogo}/>
        <Text style={registerStyles.appTitle}>Product Tracker</Text>
        <Text style={registerStyles.appTitle}>Create Your Account</Text>
    </View>
    <View>
        <Text style={registerStyles.label}>First Name: </Text>
        <TextInput style={registerStyles.inputField} onChangeText={newFirstName=>setFirstName(newFirstName)} value={firstName}/>
        <Text style={registerStyles.label}>Last Name: </Text>
        <TextInput style={registerStyles.inputField} onChangeText={newLastName=>setLastName(newLastName)} value={lastName}/>
        <Text style={registerStyles.label}>Email: </Text>
        <TextInput style={registerStyles.inputField} onChangeText={newEmail=>setEmail(newEmail)} value={email}/>
        <Text style={registerStyles.label}>Username: </Text>
        <TextInput style={registerStyles.inputField} onChangeText={newUsername=>setUsername(newUsername)} value={username}/>
        <Text style={registerStyles.label}>Password: </Text>
        <TextInput style={registerStyles.inputField} onChangeText={newPassword=>setPassword(newPassword)} value={password}/>
    </View>
    <View style={registerStyles.buttonContainer}>
        <Pressable style={registerStyles.registerButton} onPress={handleRegister}>
            <Text style={registerStyles.registerButtonText} >{registerButtonText}</Text>
        </Pressable>
    </View>
    <View style={registerStyles.buttonContainer}>
        <Pressable style={registerStyles.closeButton} onPress={closeRegScreen}>
            <Text style={registerStyles.registerButtonText} >Close</Text>
        </Pressable>
    </View>
   </ScrollView>
  )
}

export default Register

const registerStyles = StyleSheet.create({
    appTitle: {
        fontSize: 40,
        textAlign: 'center',
        marginTop: 35,
        fontFamily:'BebasNeue-Regular',
        color: colors.purple,
      },
      buttonContainer: {
        width: 50,
        textAlign: 'center',
        alignSelf: 'center',
      },
      registerButton: {
        backgroundColor: colors.purple,
        padding: 10,
        width: 160,
        alignSelf: 'center',
        borderRadius: 8,
        margin: 10,
      },
      closeButton: {
        backgroundColor: colors.red,
        padding: 10,
        width: 160,
        alignSelf: 'center',
        borderRadius: 8,
        margin: 10,
      },
      registerButtonText: {
        textAlign: 'center',
        fontSize: 15,
        color: colors.white,
        fontFamily: 'BebasNeue-Regular',
        letterSpacing:3,
        textTransform: 'uppercase',
      },
      inputField: {
        margin: 'auto',
        alignSelf: 'center',
        backgroundColor: colors.smokeWhite,
        width: 150,
        marginBottom: 20,
        borderRadius: 8,
        padding: 8,
      },
      label: {
        textAlign: 'center',
        margin: 32,
        fontSize: 16,
        fontFamily:"Lato-Italic",
        color:colors.black,
      },
      PTLogoStyle: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 35,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
      }
})