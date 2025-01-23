import React, { useState, useRef } from 'react';
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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors } from '../constants/colors';
import PTLogo from '../assets/images/ProductTrackerIcon.png';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFont } from '../context/fontContext';

type ThemeType = keyof typeof Colors;

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const Register = ({ navigation }: Props) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobileNumber: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState<'normal' | 'success' | 'error'>('normal');
  const [passwordStrength, setPasswordStrength] = useState<number>(0); // 0 = Weak, 1 = Average, 2 = Strong
  const animationValue = useRef(new Animated.Value(1)).current;
  const { theme } = useTheme();
  const { fontSize } = useFont();

  const registerStyles = styling(theme, fontSize);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setButtonState('normal');
    animateButton();

    try {
      const response = await fetch(
        'https://product-tracker-api-production.up.railway.app/api/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      Alert.alert('Success', data.message || 'Registration successful!');
      setButtonState('success');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong!');
      setButtonState('error');
    } finally {
      setIsLoading(false);
    }
  };

  const animateButton = () => {
    Animated.spring(animationValue, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(animationValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  // Password strength checker
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={registerStyles.container}>
        <View style={registerStyles.centered}>
          <Image style={registerStyles.logo} source={PTLogo} />
          <Text style={registerStyles.title}>Create your account</Text>
        </View>

        {/* Input Fields with Labels */}
        <View style={registerStyles.centered}>
          <Text style={registerStyles.label}>Email</Text>
          <TextInput
            style={registerStyles.input}
            placeholder="Email"
            onChangeText={(value) => handleInputChange('email', value)}
            value={formData.email}
          />

          <Text style={registerStyles.label}>Mobile Number</Text>
          <TextInput
            style={registerStyles.input}
            placeholder="Mobile Number"
            onChangeText={(value) => handleInputChange('mobileNumber', value)}
            value={formData.mobileNumber}
          />

          <Text style={registerStyles.label}>Username</Text>
          <TextInput
            style={registerStyles.input}
            placeholder="Username"
            onChangeText={(value) => handleInputChange('username', value)}
            value={formData.username}
          />

          <Text style={registerStyles.label}>Password</Text>
          <TextInput
            style={registerStyles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(value) => handleInputChange('password', value)}
            value={formData.password}
          />
        </View>

        {/* Password Strength Indicator */}
        {formData.password.length > 0 && (
          <View style={registerStyles.centered}>
            <Text style={registerStyles.label}>Password Strength</Text>
            <View style={registerStyles.strengthContainer}>
              <Animated.View
                style={[
                  registerStyles.strengthBar,
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
                  registerStyles.strengthBar,
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
                  registerStyles.strengthBar,
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

        {/* Register Button */}
        <View style={registerStyles.centered}>
          <View style={[registerStyles.buttonWrapper]}>
            <Animated.View
              style={[
                registerStyles.button,
                {
                  // Keep button size constant (no scaling here)
                  backgroundColor:
                    buttonState === 'success'
                      ? colors.green
                      : buttonState === 'error'
                      ? colors.red
                      : colors.purple,
                },
              ]}
            >
              <Pressable onPress={handleRegister} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Animated.View
                    style={{
                      transform: [{ scale: animationValue }], // Apply scale animation only to icon
                    }}
                  >
                    <Icon
                      name={
                        buttonState === 'success'
                          ? 'checkmark-circle'
                          : buttonState === 'error'
                          ? 'alert-circle-outline'
                          : 'add-circle-outline'
                      }
                      size={20}
                      color={colors.white}
                    />
                  </Animated.View>
                )}
              </Pressable>
            </Animated.View>
          </View>
          {/* Back Button */}
          <Pressable style={registerStyles.backButton} onPress={() => navigation.navigate('Login')}>
            <Text style={registerStyles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styling = (theme: ThemeType, fontSize: any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    centered: {
      alignItems: 'center',
    },
    title: {
      fontSize: 40,
      fontFamily: 'BebasNeue-Regular',
      color: colors.purple,
      marginTop: 35,
      marginBottom: 20,
    },
    buttonWrapper: {
      // Prevent the button wrapper from resizing
      width: '100%',
      alignItems: 'center',
    },
    button: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      height: 50,  // Fixed height for button
      borderRadius: 8,
      marginTop: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', // Center content vertically
    },
    input: {
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
    logo: {
      width: 100,
      height: 100,
      marginTop: 35,
      marginBottom: 10,
    },
    backButton: {
      backgroundColor: colors.pink,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    backButtonText: {
      textAlign: 'center',
      fontSize: fontSize,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
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

export default Register;
