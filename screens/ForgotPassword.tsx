import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { colors } from '../constants/colors';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFont } from '../context/fontContext';
type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

type ThemeType = keyof typeof Colors;

const ForgotPassword = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState<'normal' | 'success' | 'error'>('normal');
  const { theme} = useTheme();
  const {fontSize}=useFont();
  const forgotStyles = styling(theme,fontSize);
  const animationValue = useRef(new Animated.Value(1)).current;

  const handleGoBack = () => {
    navigation.navigate('Login');
  };

  const handleResetPassword = () => {
    if (!email || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required.");
      setButtonState('error');
      animateButton();
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setButtonState('error');
      animateButton();
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setButtonState('normal');

    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();

    fetch("https://product-tracker-api-production.up.railway.app/api/users/resetPassword", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        newPassword,
        confirmPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to reset password");
        }
        return response.json();
      })
      .then(() => {
        setIsSuccess(true);
        setButtonState('success');
        setErrorMessage("");
      })
      .catch((error) => {
        setErrorMessage(error.message || "Failed to reset password");
        setButtonState('error');
      })
      .finally(() => {
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).stop();
        setIsLoading(false);
      });
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ScrollView contentContainerStyle={forgotStyles.container}>
      <View style={forgotStyles.centered}>
        <Text style={forgotStyles.forgotPasswordTitle}>Reset Password</Text>
      </View>
      <View style={forgotStyles.centered}>
        <Text style={forgotStyles.label}>Email</Text>
        <TextInput
          style={forgotStyles.inputField}
          onChangeText={(newEmail) => setEmail(newEmail)}
          value={email}
        />
        <Text style={forgotStyles.label}>New Password</Text>
        <TextInput
          style={forgotStyles.inputField}
          secureTextEntry={true}
          onChangeText={(password) => setNewPassword(password)}
          value={newPassword}
        />
        <Text style={forgotStyles.label}>Confirm New Password</Text>
        <TextInput
          style={forgotStyles.inputField}
          secureTextEntry={true}
          onChangeText={(password) => setConfirmPassword(password)}
          value={confirmPassword}
        />
        {errorMessage ? (
          <Text style={{ color: colors.red }}>{errorMessage}</Text>
        ) : null}
      </View>
      <View style={forgotStyles.centered}>
        <Pressable
          style={[
            forgotStyles.loginButton,
            buttonState === 'success' && { backgroundColor: colors.green },
            buttonState === 'error' && { backgroundColor: colors.red },
          ]}
          onPress={handleResetPassword}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : buttonState === 'success' ? (
            <Icon name="checkmark-circle" size={20} color={colors.white} />
          ) : buttonState === 'error' ? (
            <Icon name="alert-circle-outline" size={20} color={colors.white} />
          ) : (
            <Text style={forgotStyles.loginButtonText}>Reset Password</Text>
          )}
        </Pressable>
        <Pressable style={forgotStyles.goBackButton} onPress={handleGoBack}>
          <Text style={forgotStyles.loginButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;

const styling = (theme: ThemeType,fontSize:number) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    centered: {
      alignItems: 'center',
    },
    forgotPasswordTitle: {
      fontSize: 40,
      fontFamily: 'BebasNeue-Regular',
      color: colors.purple,
      marginTop: 35,
      marginBottom: 20,
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
    loginButton: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginButtonText: {
      textAlign: 'center',
      fontSize:fontSize,
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
