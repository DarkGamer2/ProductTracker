import React, { useState, useEffect } from 'react';
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
  Alert
} from 'react-native';
import { colors } from '../constants/colors';
import PTLogo from '../assets/images/ProductTrackerIcon.png';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';

type ThemeType = keyof typeof Colors;

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const Register = ({ navigation }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber,setMobileNumber]=useState("")
  const [buttonText, setButtonText] = useState('Register');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccessful,setRegisterSuccessful]=useState(true);
  const [barAnimation] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);
  const { theme } = useTheme();

  const registerStyles = styling(theme);

  const calculatePasswordStrength = (password: string) => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.match(/[A-Za-z]/) && password.match(/[0-9]/)) return 2;
    if (password.length >= 8 && password.match(/[!@#$%^&*]/)) return 3;
    return 2;
  };

  const passwordStrength = calculatePasswordStrength(password);

  useEffect(() => {
    barAnimation.forEach((animatedValue, index) => {
      Animated.timing(animatedValue, {
        toValue: index < passwordStrength ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [passwordStrength, barAnimation]);

  const handleRegister = async () => {
    setIsLoading(true);
    setButtonText('Loading...');
    try {
        const response = await fetch(
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
                    mobileNumber: mobileNumber
                }),
            }
        );

        // Log the raw response for debugging
        const responseText = await response.text();  // Get the raw text
        console.log('Raw Response:', responseText);

        if (!response.ok) {
            // If response is not OK, handle it here
            const errorData = responseText ? JSON.parse(responseText) : {};
            throw new Error(errorData.error || "Something went wrong during registration.");
        }

        // Now parse the response as JSON
        const data = JSON.parse(responseText);  // Parse the raw text into JSON

        Alert.alert('Registration Successful', data.message || "You have successfully registered!");
        setRegisterSuccessful(true);
        setButtonText('Register');
        setIsLoading(false);

    } catch (error:any) {
        console.error("Registration failed:", error.message);
        Alert.alert('Registration Failed', error.message || 'Something went wrong. Please try again.');
        setButtonText('Register');
        setIsLoading(false);
    }
};

  const goBack = () => {
    navigation.navigate('Login');
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
          onChangeText={(newEmail) => setEmail(newEmail)}
          value={email}
        />
        <Text style={registerStyles.label}>Mobile Number</Text>
        <TextInput style={registerStyles.inputField} onChangeText={(newMobileNumber)=>setMobileNumber(newMobileNumber)} value={mobileNumber}/>
        <Text style={registerStyles.label}>Username: </Text>
        <TextInput
          style={registerStyles.inputField}
          onChangeText={(newUsername) => setUsername(newUsername)}
          value={username}
        />
        <Text style={registerStyles.label}>Password: </Text>
        <TextInput
          style={registerStyles.inputField}
          onChangeText={(newPassword) => setPassword(newPassword)}
          value={password}
          secureTextEntry={true}
        />
        {password.length > 0 && (
          <View style={registerStyles.strengthIndicator}>
            {barAnimation.map((animatedValue, index) => (
              <Animated.View
                key={index}
                style={[
                  registerStyles.strengthBar,
                  index === 0 ? registerStyles.weak : index === 1 ? registerStyles.medium : registerStyles.strong,
                  {
                    opacity: animatedValue,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
      <View style={registerStyles.centered}>
        <Pressable
          style={registerStyles.loginButton}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={registerStyles.loginButtonText}>{buttonText}</Text>
          )}
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
      fontSize: 16,
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
