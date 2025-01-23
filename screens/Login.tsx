import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import PTLogo from '../assets/images/ProductTrackerIcon.png';
import {colors} from '../constants/colors';
import Colors from '../context/theme/Colors';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useTheme} from '../context/theme/ThemeContext';
import {useFont} from '../context/fontContext';

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const API_URL = 'https://product-tracker-api-production.up.railway.app/api/login';

const Login: React.FC<Props> = ({navigation}) => {
  const [credentials, setCredentials] = useState({username: '', password: ''});
  const [status, setStatus] = useState({
    isLoading: false,
    errorMessage: '',
    modalVisible: false,
  });

  const {theme} = useTheme();
  const {fontSize} = useFont();

  // Combine static and dynamic styles
  const dynamicStyles = getDynamicStyles(theme, fontSize);
  const combinedStyles = {...staticStyles, ...dynamicStyles};

  const handleChange = (field: keyof typeof credentials, value: string) => {
    setCredentials(prev => ({...prev, [field]: value}));
  };

  const handleLogin = useCallback(async () => {
    setStatus({isLoading: true, errorMessage: '', modalVisible: false});

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorMessages: Record<number, string> = {
          401: 'Incorrect credentials',
          404: 'User does not exist',
        };
        const errorMessage = errorMessages[response.status] || 'An unknown error occurred';
        throw new Error(errorMessage);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      navigation.navigate('BottomTabNavigator', {
        screen: 'Home',
        params: {username: credentials.username},
      });
    } catch (error: any) {
      setStatus({
        isLoading: false,
        errorMessage: error.message || 'Network error occurred',
        modalVisible: true,
      });
    } finally {
      setStatus(prev => ({...prev, isLoading: false}));
    }
  }, [credentials, navigation]);

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[theme]?.themeColor }}> 
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
      >
        <View style={combinedStyles.centered}>
          <Image style={combinedStyles.PTLogo} source={PTLogo} />
          <Text style={combinedStyles.appTitle}>Product Tracker</Text>
        </View>
  
        <View style={combinedStyles.centered}>
          <Text style={combinedStyles.label}>Username:</Text>
          <TextInput
            style={combinedStyles.inputField}
            value={credentials.username}
            onChangeText={text => handleChange('username', text)}
          />
          <Text style={combinedStyles.label}>Password:</Text>
          <TextInput
            style={combinedStyles.inputField}
            secureTextEntry
            value={credentials.password}
            onChangeText={text => handleChange('password', text)}
          />
        </View>
  
        <View style={combinedStyles.centered}>
          <Pressable style={combinedStyles.button} onPress={handleLogin}>
            <Text style={combinedStyles.buttonText}>
              {status.isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </Pressable>
        </View>
  
        <View style={combinedStyles.centered}>
          <Pressable 
            style={combinedStyles.registerButton} 
            onPress={() => handleNavigation('Register')}
          >
            <Text style={combinedStyles.registerButtonText}>Register</Text>
          </Pressable>
        </View>
  
        <Text
          style={combinedStyles.forgotPasswordText}
          onPress={() => handleNavigation('ForgotPassword')}
        >
          Forgot Password?
        </Text>
  
        <Modal
          animationType="slide"
          transparent
          visible={status.modalVisible}
          onRequestClose={() => setStatus(prev => ({...prev, modalVisible: false}))}
        >
          <View style={combinedStyles.modalContainer}>
            <View style={combinedStyles.modalView}>
              <Text style={combinedStyles.modalText}>{status.errorMessage}</Text>
              <Pressable
                style={combinedStyles.closeButton}
                onPress={() => setStatus(prev => ({...prev, modalVisible: false}))}
              >
                <Text style={combinedStyles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );  
};

// Static styles for better autocomplete
const staticStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  PTLogo: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  appTitle: {
    fontSize: 40,
    fontFamily: 'BebasNeue-Regular',
    color: colors.purple,
    marginTop: 35,
    marginBottom: 20,
  },
  forgotPasswordText: {
    textAlign: 'center',
    fontFamily: 'Lato-Italic',
    marginVertical: 20,
    color: colors.purple,
  },
});

// Dynamic styles that depend on theme and fontSize
const getDynamicStyles = (theme: keyof typeof Colors, fontSize: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors[theme]?.backgroundColor,
      
    },
    label: {
      marginBottom: 10,
      fontSize,
      fontFamily: 'Lato-Italic',
      color: Colors[theme]?.textColor,
    },
    inputField: {
      width: 200,
      marginBottom: 20,
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.purple,
      color: Colors[theme]?.textColor,
    },
    button: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    buttonText: {
      textAlign: 'center',
      fontSize,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
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
      fontSize,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      backgroundColor: Colors[theme]?.backgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      textAlign: 'center',
      color: Colors[theme]?.textColor,
      fontFamily: 'Lato-Italic',
      fontSize,
      marginBottom: 15,
    },
    closeButton: {
      backgroundColor: colors.pink,
      padding: 10,
      borderRadius: 8,
      marginTop: 20,
    },
  });

export default Login;
