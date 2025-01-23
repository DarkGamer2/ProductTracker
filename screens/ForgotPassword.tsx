import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Animated,
  ActivityIndicator,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { colors } from '../constants/colors';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFont } from '../context/fontContext';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

type ThemeType = keyof typeof Colors;

const ForgotPassword = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState<'normal' | 'success' | 'error'>('normal');
  const [passwordStrength, setPasswordStrength] = useState<number>(0); // 0 = Weak, 1 = Average, 2 = Strong
  const { theme } = useTheme();
  const { fontSize } = useFont();
  const forgotStyles = styling(theme, fontSize);
  const animationValue = useRef(new Animated.Value(0)).current;
  
  const handleGoBack = () => {
    navigation.navigate('Login');
  };

  // Regex for validating email
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Handle password strength check
  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    // Minimum 6 characters
    if (password.length >= 6) strength++;

    // Check for uppercase, lowercase, numbers, and special characters
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    // Set password strength (0 = Weak, 1 = Average, 2 = Strong)
    if (strength >= 4) {
      setPasswordStrength(2); // Strong
    } else if (strength === 3) {
      setPasswordStrength(1); // Average
    } else {
      setPasswordStrength(0); // Weak
    }

    // Animate the bar color change based on the password strength
    animateStrengthBar(password.length);
  };

  const animateStrengthBar = (passwordLength: number) => {
    let targetValue = 0;

    if (passwordLength >= 10) {
      targetValue = 2; // Green
    } else if (passwordLength >= 6) {
      targetValue = 1; // Orange
    } else {
      targetValue = 0; // Red
    }

    Animated.timing(animationValue, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Handle reset password
  const handleResetPassword = () => {
    // Validate form fields
    if (!email || !newPassword || !confirmPassword) {
      setErrorMessage('All fields are required.');
      setButtonState('error');
      animateButton();
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Invalid email address.');
      setButtonState('error');
      animateButton();
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setButtonState('error');
      animateButton();
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      setButtonState('error');
      animateButton();
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setButtonState('normal');
    animateButton();

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
          throw new Error('Failed to reset password');
        }
        return response.json();
      })
      .then(() => {
        setIsSuccess(true);
        setButtonState('success');
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(error.message || 'Failed to reset password');
        setButtonState('error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Animation for button states
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

      {/* Input Fields */}
      <View style={forgotStyles.centered}>
        <Text style={forgotStyles.label}>Email</Text>
        <TextInput
          style={forgotStyles.inputField}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={forgotStyles.label}>New Password</Text>
        <TextInput
          style={forgotStyles.inputField}
          secureTextEntry
          onChangeText={(password) => {
            setNewPassword(password);
            checkPasswordStrength(password);
          }}
          value={newPassword}
        />
        <Text style={forgotStyles.label}>Confirm New Password</Text>
        <TextInput
          style={forgotStyles.inputField}
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        {errorMessage ? (
          <Text style={{ color: colors.red }}>{errorMessage}</Text>
        ) : null}
      </View>

      {/* Password Strength Indicator */}
      {newPassword.length > 0 && (
        <View style={forgotStyles.centered}>
          <Text style={forgotStyles.label}>Password Strength</Text>
          <View style={forgotStyles.strengthContainer}>
            <Animated.View
              style={[
                forgotStyles.strengthBar,
                {
                  backgroundColor:
                    animationValue.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [colors.red, colors.orange, colors.green],
                    }),
                  flex: 1,
                },
              ]}
            />
            <Animated.View
              style={[
                forgotStyles.strengthBar,
                {
                  backgroundColor:
                    animationValue.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [colors.red, colors.orange, colors.green],
                    }),
                  flex: 1,
                },
              ]}
            />
            <Animated.View
              style={[
                forgotStyles.strengthBar,
                {
                  backgroundColor:
                    animationValue.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [colors.red, colors.orange, colors.green],
                    }),
                  flex: 1,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={forgotStyles.centered}>
        <TouchableNativeFeedback
          onPress={handleResetPassword}
          background={TouchableNativeFeedback.SelectableBackground()}
        >
          <View
            style={[
              forgotStyles.loginButton,
              buttonState === 'success' && { backgroundColor: colors.green },
              buttonState === 'error' && { backgroundColor: colors.red },
            ]}
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
          </View>
        </TouchableNativeFeedback>

        <Pressable style={forgotStyles.goBackButton} onPress={handleGoBack}>
          <Text style={forgotStyles.loginButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;

const styling = (theme: ThemeType, fontSize: number) =>
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
      fontSize: fontSize,
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
    strengthContainer: {
      flexDirection: 'row',
      width: 200,
      height: 10,
      marginBottom: 20,
      marginTop: 10,
    },
    strengthBar: {
      height: 10,
      borderRadius: 5,
      margin: 2,
      backgroundColor: colors.darkGray,
    },
  });
