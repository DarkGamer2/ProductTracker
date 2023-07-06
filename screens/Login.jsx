import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image
} from 'react-native';
import {useState} from 'react';
import React from 'react';
import {Pressable} from 'react-native';
import {colors} from '../constants/colors';
import PTLogo from "../assets/images/ProductTrackerIcon.png"
const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonText, setButtonText] = useState('Login');
  const handleLogin = () => {
    navigation.navigate('Navbar'),
      setButtonText(
        <Text>
          <ActivityIndicator size={'small'} color={'white'} /> Logging in...
        </Text>,
      );
  };
  return (
    <ScrollView>
      <View>
        <Image style={loginStyles.PTLogoStyle} source={PTLogo}/>
        <Text style={loginStyles.appTitle}>Product Tracker</Text>
      </View>
      <View>
        <Text style={loginStyles.label}>Username: </Text>
        <TextInput
          style={loginStyles.inputField}
          onChangeText={newUsername => setUsername(newUsername)}
          value={username}
        />
        <Text style={loginStyles.label}>Password: </Text>
        <TextInput
          style={loginStyles.inputField}
          onChangeText={newPassword => setPassword(newPassword)}
          value={password}
        />
      </View>
      <View style={loginStyles.buttonContainer}>
        <Pressable style={loginStyles.loginButton} onPress={handleLogin}>
          <Text style={loginStyles.loginButtonText}>{buttonText}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Login;

const loginStyles = StyleSheet.create({
  appTitle: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 35,
    fontFamily:'BebasNeue-Regular',
    color: colors.purple,
  },

  loginButton: {
    backgroundColor: colors.purple,
    padding: 10,
    width: 160,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 25,
  },
  loginButtonText: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.white,
    fontFamily: 'BebasNeue-Regular',
    letterSpacing:3
  },
  buttonContainer: {
    width: 50,
    textAlign: 'center',
    alignSelf: 'center',
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
});
