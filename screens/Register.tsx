import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import PTLogo from '../assets/images/ProductTrackerIcon.png';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

type ThemeType = keyof typeof Colors;

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const Register = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState<'normal' | 'success' | 'error'>('normal');
  const animationValue = useRef(new Animated.Value(1)).current;
  const { theme,fontSize } = useTheme();

  const registerStyles = styling(theme,fontSize);

  const handleRegister = async () => {
    setIsLoading(true);
    setButtonState('normal');
    animateButton();

    try {
      const response = await fetch('https://product-tracker-api-production.up.railway.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, mobileNumber }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      Alert.alert('Success', data.message || 'Registration successful!');
      setButtonState('success');
    } catch (error:any) {
      Alert.alert('Error', error.message || 'Something went wrong!');
      setButtonState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animationValue, { toValue: 1.1, duration: 300, useNativeDriver: true }),
      Animated.timing(animationValue, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

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
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />
           <Text style={registerStyles.label}>Mobile Number</Text>
        <TextInput
          style={registerStyles.inputField}
          placeholder="Mobile Number"
          onChangeText={setMobileNumber}
          value={mobileNumber}
        />
        <Text style={registerStyles.label}>Username: </Text>
        <TextInput
          style={registerStyles.inputField}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
         <Text style={registerStyles.label}>Password: </Text>
        <TextInput
          style={registerStyles.inputField}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>
      <View style={registerStyles.centered}>
        <Animated.View
          style={[
            registerStyles.loginButton,
            { transform: [{ scale: animationValue }] },
            buttonState === 'success' && { backgroundColor: colors.green },
            buttonState === 'error' && { backgroundColor: colors.red },
          ]}
        >
          <Pressable onPress={handleRegister} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : buttonState === 'success' ? (
              <Icon name="checkmark-circle" size={20} color={colors.white} />
            ) : buttonState === 'error' ? (
              <Icon name="alert-circle-outline" size={20} color={colors.white} />
            ) : (
              <Text style={registerStyles.loginButtonText}>Register</Text>
            )}
          </Pressable>
        </Animated.View>
        <Pressable style={registerStyles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={registerStyles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styling = (theme: ThemeType,fontSize:any) =>
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
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', // Center content vertically
    },
    loginButtonText: {
      textAlign: 'center',
      fontSize: fontSize,
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
      borderWidth: 1,
      borderColor: colors.purple,
    },
    label: {
      fontSize: fontSize,
      fontFamily: 'Lato-Italic',
      color: Colors[theme]?.textColor,
      marginBottom: 10,
    },
    PTLogoStyle: {
      width: 100,
      height: 100,
      marginTop: 35,
      marginBottom: 10,
    },
    strengthIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    strengthBar: {
      width: 60,
      height: 5,
      marginHorizontal: 2,
      borderRadius: 2,
    },
    weak: {
      backgroundColor: 'red',
    },
    medium: {
      backgroundColor: 'orange',
    },
    strong: {
      backgroundColor: 'green',
    },
    backButtonText: {
      textAlign: 'center',
      fontSize: fontSize,
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

export default Register;
