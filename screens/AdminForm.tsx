import { StyleSheet, Text, View, SafeAreaView, Pressable, TextInput, Animated, Alert, ActivityIndicator } from 'react-native';
import { useRef, useState } from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { colors } from '../constants/colors';
import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';

type ThemeType = keyof typeof Colors;
type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

const AdminForm = ({ navigation }: Props) => {
  const { theme ,fontSize} = useTheme(); // Use `theme` from context
  const styles = styling(theme, fontSize); // Generate styles dynamically
  const [adminStatus, setAdminStatus] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // To track success or failure
  const animatedValue = useRef(new Animated.Value(1)).current; // Define animated value for button scale

  const changeAdminStatus = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setIsLoading(true); // Start loading
    try {
      // Fetch the current admin status for the entered username
      const response = await fetch(
        'https://product-tracker-api-production.up.railway.app/api/users/adminAccess',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const result = await response.json();
        const isAdmin = result.isAdmin;

        if (isAdmin) {
          Alert.alert('Error', `${username} already has admin access`);
          setIsLoading(false);
          return;
        }

        // If not admin, send PUT request to update status
        const updateResponse = await fetch(
          'https://product-tracker-api-production.up.railway.app/api/users/adminAccess',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, isAdmin: true }),
          }
        );

        if (updateResponse.ok) {
          // Animation loop to scale the button
          Animated.loop(
            Animated.sequence([
              Animated.timing(animatedValue, {
                toValue: 1.1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
            ])
          ).start();

          Alert.alert('Success', `${username} has been granted admin access`);
          setAdminStatus(true); // Update admin status state
          setIsSuccess(true); // Set success state to true
        } else {
          const errorText = await updateResponse.text();
          throw new Error(`Failed to update admin status: ${errorText}`);
        }
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response format: ${text}`);
      }
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsLoading(false); // Stop loading after the request is done
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text style={styles.screenTitle}>Get Admin Access</Text>
        <View>
          <Text style={styles.label}>Username: </Text>
          <TextInput
            style={styles.inputField}
            placeholder="Enter full name"
            value={username}
            onChangeText={setUsername} // Update username state on input
          />
        </View>
        <View>
          <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
            <Pressable
              style={[
                styles.submitButton,
                { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
              ]}
              onPress={changeAdminStatus}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : isSuccess ? (
                <Text style={styles.submitButtonText}>Admin Access Granted</Text> // Show success message
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </Pressable>
          </Animated.View>
        </View>
        <Pressable style={styles.closeButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.closeButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AdminForm;

const styling = (theme: ThemeType, fontSize: number) => {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    label: {
      fontSize: fontSize,
      marginBottom: 10,
      color: Colors[theme]?.textColor,
      fontFamily: 'Lato-Italic', // Ensure text color matches the theme
      textAlign: 'center',
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
    submitButton: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    submitButtonText: {
      textAlign: 'center',
      fontSize: fontSize,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    screenTitle: {
      fontSize: fontSize,
      fontFamily: 'BebasNeue-Regular',
      color: colors.purple,
      marginTop: 35,
      marginBottom: 20,
    },
    centered: {
      alignItems: 'center',
    },
    closeButton: {
      backgroundColor: colors.red,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    closeButtonText: {
      color: colors.white,
      fontSize: fontSize,
      fontFamily: 'BebasNeue-Regular',
      textAlign: 'center',
    },
  });
};
