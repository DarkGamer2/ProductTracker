import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useTheme} from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import {colors} from '../constants/colors';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

type ThemeType = keyof typeof Colors;

const ForgotPassword = ({navigation}: Props) => {
  const {theme} = useTheme();
  const forgotStyles = styling(theme);

  const handleGoBack = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={forgotStyles.container}>
      <View style={forgotStyles.centered}>
        <Text style={forgotStyles.forgotPasswordTitle}>Reset Password</Text>
      </View>
      <View style={forgotStyles.centered}>
        <Text style={forgotStyles.label}>New Password</Text>
        <TextInput style={forgotStyles.inputField} secureTextEntry={true} />
        <Text style={forgotStyles.label}>Confirm New Password</Text>
        <TextInput style={forgotStyles.inputField} secureTextEntry={true} />
      </View>
      <View style={forgotStyles.centered}>
        <Pressable style={forgotStyles.loginButton}>
          <Text style={forgotStyles.loginButtonText}>Submit</Text>
        </Pressable>
        <Pressable style={forgotStyles.goBackButton} onPress={handleGoBack}>
          <Text style={forgotStyles.loginButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;

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
      fontSize: 16,
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
    },
    loginButtonText: {
      textAlign: 'center',
      fontSize: 15,
      color: Colors[theme]?.textColor,
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
