import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import PTLogo from '../assets/images/ProductTrackerIcon.png';
import {colors} from '../constants/colors';
import Colors from '../context/theme/Colors';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useTheme} from '../context/theme/ThemeContext';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

type ThemeType = keyof typeof Colors;

const Login = ({navigation}: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonText, setButtonText] = useState('Login');

  const {theme} = useTheme();

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://product-tracker-api-production.up.railway.app/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      setButtonText('Logging in...');

      // Log response status and body
      console.log('Response Status:', response.status);
      const responseBody = await response.text();
      console.log('Response Body:', responseBody);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = JSON.parse(responseBody);

      // Check for error in response data
      if (data.error) {
        console.log('Login failed:', data.error);
      } else {
        navigation.navigate('BottomTabNavigator', {
          screen: 'Home',
          params: {username: username},
        });
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setButtonText('Login');
    }
  };

  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const loginStyles = styling(theme);

  return (
    <ScrollView contentContainerStyle={loginStyles.container}>
      <View style={loginStyles.centered}>
        <Image style={loginStyles.PTLogoStyle} source={PTLogo} />
        <Text style={loginStyles.appTitle}>Product Tracker</Text>
      </View>
      <View style={loginStyles.centered}>
        <Text style={loginStyles.label}>Username: </Text>
        <TextInput
          style={loginStyles.inputField}
          onChangeText={newUsername => setUsername(newUsername)}
          value={username}
        />
        <Text style={loginStyles.label}>Password: </Text>
        <TextInput
          secureTextEntry={true}
          style={loginStyles.inputField}
          onChangeText={newPassword => setPassword(newPassword)}
          value={password}
        />
      </View>
      <View style={loginStyles.centered}>
        <Pressable style={loginStyles.loginButton} onPress={handleLogin}>
          <Text style={loginStyles.loginButtonText}>{buttonText}</Text>
        </Pressable>
      </View>
      <View style={loginStyles.centered}>
        <Pressable
          style={loginStyles.registerButton}
          onPress={handleRegisterNavigation}>
          <Text style={loginStyles.registerButtonText}>Register</Text>
        </Pressable>
      </View>
      <View>
        <Text
          style={loginStyles.forgotPasswordText}
          onPress={handleForgotPassword}>
          Forgot Password?
        </Text>
      </View>
    </ScrollView>
  );
};

export default Login;

const styling = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    centered: {
      alignItems: 'center',
    },
    appTitle: {
      fontSize: 40,
      fontFamily: 'BebasNeue-Regular',
      color: colors.purple,
      marginTop: 35,
      marginBottom: 20,
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
      color: Colors[theme]?.textColor,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    registerButton: {
      backgroundColor: colors.pink,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    registerButtonText: {
      textAlign: 'center',
      fontSize: 15,
      color: Colors[theme]?.textColor,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    inputField: {
      color: Colors[theme]?.textColor,
      width: 200,
      marginBottom: 20,
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.purple,
    },
    label: {
      marginBottom: 10,
      fontSize: 16,
      fontFamily: 'Lato-Italic',
      color: Colors[theme]?.textColor,
    },
    PTLogoStyle: {
      width: 100,
      height: 100,
      marginTop: 35,
      marginBottom: 10,
    },
    forgotPasswordText: {
      textAlign: 'center',
      fontSize: 15,
      color: colors.purple,
      fontFamily: 'Lato-Italic',
      margin: 20,
    },
  });
