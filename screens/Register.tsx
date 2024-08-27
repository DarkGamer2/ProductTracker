import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../constants/colors';
import PTLogo from '../assets/images/ProductTrackerIcon.png';
import {ActivityIndicator} from 'react-native';
import {useTheme} from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
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
const Register = ({navigation}:Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [buttonText, setButtonText] = useState('Register');
  const [email, setEmail] = useState('');
  const [registerSuccessful, setRegisterSuccessful] = useState(true);
  const {theme} = useTheme();
  const handleRegister = () => {
    fetch(
      'https://product-tracker-api-production.up.railway.app/api/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
        }),
      },
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        navigation.navigate('BottomTabNavigator');
      })
      .catch(err => console.log(err));
  };

  const goBack = () => {
    navigation.navigate('Login');
  };

  const registerStyles = styling(theme);
  return (
    <ScrollView contentContainerStyle={registerStyles.container}>
      <View style={registerStyles.centered}>
        <Image style={registerStyles.PTLogoStyle} source={PTLogo} />
        <Text style={registerStyles.appTitle}>Create your account</Text>
      </View>
      <View style={registerStyles.centered}>
        <Text style={registerStyles.label}>Email: </Text>
        <TextInput
          style={registerStyles.inputField}
          onChangeText={newEmail => setEmail(newEmail)}
          value={email}
        />
        <Text style={registerStyles.label}>Username: </Text>
        <TextInput
          style={registerStyles.inputField}
          onChangeText={newUsername => setUsername(newUsername)}
          value={username}
        />
        <Text style={registerStyles.label}>Password: </Text>
        <TextInput
          style={registerStyles.inputField}
          onChangeText={newPassword => setPassword(newPassword)}
          value={password}
        />
      </View>
      <View style={registerStyles.centered}>
        <Pressable style={registerStyles.loginButton} onPress={handleRegister}>
          <Text style={registerStyles.loginButtonText}>{buttonText}</Text>
        </Pressable>
        <Pressable style={registerStyles.backButton} onPress={goBack}>
          <Text style={registerStyles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Register;

const styling = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor:Colors[theme]?.backgroundColor,
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
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    registerButton: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    registerButtonText: {
      textAlign: 'center',
      fontSize: 15,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    inputField: {
      color: Colors[theme]?.textColor,
      width: 200,
      marginBottom: 20,
      borderRadius: 8,
      padding: 8,
      borderWidth:1,
      borderColor:colors.purple,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Lato-Italic',
      color: Colors[theme]?.textColor,
      marginBottom:10,
    },
    PTLogoStyle: {
      width: 100,
      height: 100,
      marginTop: 35,
      marginBottom: 10,
    },
    backButtonText: {
      textAlign: 'center',
      fontSize: 15,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    backButton: {
      backgroundColor: colors.pink,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
  });
