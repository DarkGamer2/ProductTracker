import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/Ionicons';
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

const Feedback = ({ navigation }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [buttonColor, setButtonColor] = useState(colors.purple);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const animationValue = useRef(new Animated.Value(1)).current; // For button animation

  const { theme,fontSize } = useTheme();
  const feedbackStyles = styling(theme,fontSize);

  const handleSubmitFeedback = () => {
    setIsLoading(true);
    setIsSuccess(false);

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

    fetch('https://product-tracker-api-production.up.railway.app/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        feedback,
      }),
    })
      .then(() => {
        setButtonColor(colors.green);
        setIsLoading(false);
        setIsSuccess(true);
        Animated.timing(animationValue, { toValue: 1, duration: 300, useNativeDriver: true }).stop();
      })
      .catch((error) => {
        console.error('Error submitting feedback:', error);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={feedbackStyles.container}>
      <View style={feedbackStyles.centered}>
        <Text style={feedbackStyles.appTitle}>Feedback</Text>
        <View>
          <Text style={feedbackStyles.feedbackFormLabel}>First Name</Text>
          <TextInput
            style={feedbackStyles.feedbackFormInput}
            onChangeText={setFirstName}
            value={firstName}
            placeholder="Enter your first name"
          />
          <Text style={feedbackStyles.feedbackFormLabel}>Last Name</Text>
          <TextInput
            style={feedbackStyles.feedbackFormInput}
            onChangeText={setLastName}
            value={lastName}
            placeholder="Enter your last name"
          />
          <Text style={feedbackStyles.feedbackFormLabel}>Feedback</Text>
          <TextInput
            style={feedbackStyles.feedbackFormInputTextArea}
            onChangeText={setFeedback}
            value={feedback}
            placeholder="Enter your feedback"
            multiline
          />
        </View>
        <View>
          <Animated.View style={{ transform: [{ scale: animationValue }] }}>
            <Pressable
              style={[
                feedbackStyles.loginButton,
                { backgroundColor: buttonColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
              ]}
              onPress={handleSubmitFeedback}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : isSuccess ? (
                <Icon name="checkmark-circle" size={20} color={colors.white} />
              ) : (
                <Text style={feedbackStyles.loginButtonText}>Submit</Text>
              )}
            </Pressable>
          </Animated.View>
          <Pressable
            style={feedbackStyles.goBackButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={feedbackStyles.loginButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Feedback;

const styling = (theme: ThemeType,fontSize:any) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    appTitle: {
      fontSize: fontSize,
      textAlign: 'center',
      fontFamily: 'BebasNeue-Regular',
      color: colors.purple, // Assuming you want to keep the static color for now.
    },
    feedbackFormLabel: {
      fontSize: fontSize,
      fontFamily: 'Lato-Italic',
      color: Colors[theme]?.textColor,
      marginBottom: 10,
      textAlign: 'center',
    },
    feedbackFormInput: {
      color: Colors[theme]?.textColor,
      width: 200,
      marginBottom: 20,
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.purple,
    },
    feedbackFormInputTextArea: {
      color: Colors[theme]?.textColor,
      width: 200,
      height: 200,
      marginBottom: 20,
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.purple,
    },
    centered: {
      alignItems: 'center',
    },
    loginButton: {
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
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
  });
