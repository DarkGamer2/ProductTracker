import { NavigationProp, RouteProp } from '@react-navigation/native';
import { StyleSheet, Text, View, Pressable, Modal, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/theme/ThemeContext';
import { useFont } from '../context/fontContext'; // Import the FontContext hook
import Colors from '../context/theme/Colors';
import { useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/colors';

type ThemeType = keyof typeof Colors;

const Settings = ({ navigation, route }: { navigation: NavigationProp<any, any>, route: RouteProp<{ params: { userId: string } }, 'params'> }) => {
  const [adminAccess, setAdminAccess] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const slideAnim = useRef(new Animated.Value(300)).current; // Default off-screen position
  const { theme, setTheme } = useTheme();
  const { fontSize, updateFontSize } = useFont(); // Access font size from context
  const { userId } = route.params || {};
  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  const logOut = async () => {
    await fetch('https://product-tracker-api-production.up.railway.app/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      navigation.navigate('Login');
    });
  };

  const handlePress = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const styles = styling(theme, fontSize);

  const saveFontSize = (size: number) => {
    updateFontSize(size);  // Use context function to update font size globally
  };

  const fetchUserIdFromAPI = async () => {
    try {
      if (!userId) {
        console.log('User ID not available in route params');
        return null;
      }

      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(
        `https://product-tracker-api-production.up.railway.app/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      return data._id;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  };

  const slideUp = () => {
    setShowModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      slideAnim.setValue(300);
    });
  };

  const handleAdminAccess = async () => {
    try {
      const response = await fetch(
        'https://product-tracker-api-production.up.railway.app/api/users/adminAccess',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const result = await response.json();
      setAdminAccess(result.isAdmin);
      if (!result.isAdmin) {
        slideUp();
      } else {
        navigation.navigate('AdminDashboard');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <Text style={styles.appTitle}>Settings</Text>
        <View style={styles.separator} />
        <View style={styles.row}>
          <View style={styles.option}>
            <Text style={styles.text}>Dark Mode</Text>
            <Pressable onPress={handlePress} style={styles.pressableStyle}>
              <MaterialCommunityIcons
                name={theme === 'dark' ? 'toggle-switch' : 'toggle-switch-off'}
                color={theme === 'dark' ? 'green' : 'grey'}
                size={30}
              />
            </Pressable>
          </View>
          <View style={styles.option}>
            <Text style={styles.text}>Font Size</Text>
            <SelectDropdown
              data={fontSizes}
              defaultValue={`${fontSize}`}
              onSelect={(selectedItem: number) => saveFontSize(selectedItem)}
              renderButton={(selectedItem: number) => (
                <View style={styles.dropdownButton}>
                  <Text style={styles.buttonText}>
                    {selectedItem || fontSize}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    style={styles.buttonIcon}
                  />
                </View>
              )}
              renderItem={(item) => (
                <View style={styles.dropdownItem}>
                  <Text style={styles.itemText}>{item.toString()}</Text>
                </View>
              )}
              dropdownStyle={styles.dropdownStyle}
            />
          </View>
        </View>
        <View style={styles.option}>
          <Text style={styles.text}>Profile</Text>
          <Pressable
            style={styles.profileViewButton}
            onPress={async () => {
              const userId = await fetchUserIdFromAPI();
              if (userId) {
                navigation.navigate('Profile', { _id: userId });
              } else {
                console.log('User ID not found');
              }
            }}>
            <Text style={styles.profileViewText}>View</Text>
          </Pressable>
        </View>
        <View style={styles.option}>
          <Text style={styles.text}>Logout</Text>
          <Pressable onPress={logOut} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>
      </View>
      <View>
        <Pressable
          style={styles.feedbackButton}
          onPress={() => navigation.navigate('Feedback')}>
          <Text style={styles.feedbackButtonText}>Feedback</Text>
        </Pressable>
      </View>
      <View>
        <Pressable
          style={styles.adminButton}
          onPress={() => {
            handleAdminAccess();
          }}>
          <Text style={styles.adminButtonText}>Admin</Text>
        </Pressable>
        <SafeAreaView>
          <Modal visible={showModal} transparent>
            <View style={styles.modalContainer}>
              <Animated.View
                style={[
                  styles.modalView,
                  { transform: [{ translateY: slideAnim }] },
                ]}>
                <Text style={styles.modalText}>
                  You do not currently have admin privileges
                </Text>
                <Pressable style={styles.closeButton} onPress={slideDown}>
                  <Text style={styles.feedbackButtonText}>Close</Text>
                </Pressable>
                <Pressable
                  style={styles.getAdminAccessButton}
                  onPress={() => navigation.navigate("AdminForm")}>
                  <Text style={styles.feedbackButtonText}>
                    Get Admin Access
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styling = (theme: ThemeType, fontSize: number) =>
  StyleSheet.create({
    appTitle: {
      fontSize: 35,
      textAlign: 'center',
      fontFamily: 'BebasNeue-Regular',
      color: colors.purple,
    },
    container: {
      flex: 1,
      padding: 20,
     
    },
    separator: {
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme]?.textColor,
      marginVertical: 10,
    },
    row: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
    },
    option: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: 10,
    },
    text: {
      fontSize: fontSize,
      color: Colors[theme]?.textColor,
    },
    pressableStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    safeView: {
      flex: 1,
      backgroundColor:Colors[theme]?.themeColor
    },
    dropdownButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 18,
      marginRight: 5,
      color: Colors[theme]?.textColor,
    },
    buttonIcon: {
      color: Colors[theme]?.textColor,
    },
    dropdownItem: {
      padding: 10,
    },
    itemText: {
      fontSize: fontSize,
    },
    dropdownStyle: {
      marginTop: 2,
      backgroundColor: 'white',
      borderRadius: 5,
    },
    profileViewButton: {
      backgroundColor: colors.purple,
      padding: 10,
      paddingLeft: 10,
      borderRadius: 5,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    profileViewText: {
      color: colors.white,
      fontSize: fontSize,
      fontFamily: 'BebasNeue-Regular',
      textAlign: 'center',
    },
    logoutButton: {
      marginTop: 20,
      backgroundColor: colors.red,
      padding: 10,
      paddingLeft: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutButtonText: {
      color: colors.white,
      fontSize: fontSize,
      fontFamily: 'BebasNeue-Regular',
      textAlign: 'center',
    },
    feedbackButton: {
      backgroundColor: colors.purple,
      padding: 10,
      paddingLeft: 10,
      borderRadius: 5,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      width: 200,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    feedbackButtonText: {
      color: colors.white,
      fontSize: fontSize,
      fontFamily: 'BebasNeue-Regular',
      textAlign: 'center',
    },
    adminButton: {
      backgroundColor: colors.red,
      padding: 10,
      paddingLeft: 10,
      borderRadius: 5,
      marginBottom: 120,
      justifyContent: 'center',
      alignItems: 'center',
      width: 200,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    adminButtonText: {
      color: colors.white,
      fontSize: fontSize,
      fontFamily: 'BebasNeue-Regular',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: Colors[theme]?.backgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: Colors[theme]?.textColor,
      fontFamily: "Lato-Italic",
    },
    closeButton: {
      backgroundColor: colors.red,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    getAdminAccessButton: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
  });

