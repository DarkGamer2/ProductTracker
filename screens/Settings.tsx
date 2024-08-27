import {NavigationProp} from '@react-navigation/native';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import {useState} from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../constants/colors';
type ThemeType = keyof typeof Colors;

const Settings = ({navigation}: {navigation: NavigationProp<any, any>}) => {
  const [fontSize, setFontSize] = useState<number>(20);
  const {theme, setTheme} = useTheme();

  const fontSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
  const logOut = async () => {
    await fetch(
      'https://product-tracker-api-production.up.railway.app/api/logout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(() => {
      navigation.navigate('Login');
    });
  };

  const handlePress = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const styles = styling(theme, fontSize);

  const saveFontSize = async (size: number) => {
    try {
      await AsyncStorage.setItem('fontSize', size.toString());
      setFontSize(size);
    } catch (e) {
      console.log('Error saving fontSize', e);
    }
  };

  const loadFontSize = async () => {
    try {
      const size = await AsyncStorage.getItem('fontSize');
      if (size !== null) {
        setFontSize(parseInt(size, 10));
      }
    } catch (e) {
      console.log('Error loading fontSize', e);
    }
  };

  useEffect(() => {
    loadFontSize();
  }, []);

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
              onSelect={(selectedItem: number) => {
                setFontSize(selectedItem);
                saveFontSize(selectedItem);
              }}
              renderButton={(selectedItem: number) => (
                <View style={styles.dropdownButton}>
                  <Text style={styles.buttonText}>20</Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    style={styles.buttonIcon}
                  />
                </View>
              )}
              renderItem={({item}) => {
                return (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.itemText}>{item.toString()}</Text>
                  </View>
                );
              }}
              dropdownStyle={styles.dropdownStyle}
              dropdownOverlayColor="transparent"
            />
          </View>
          <View style={styles.option}>
            <Text style={styles.text}>Profile</Text>
            <Pressable
              style={styles.profileViewButton}
              onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.profileViewText}>View</Text>
            </Pressable>
          </View>
          <View style={styles.option}>
            <Text style={styles.text}>Logout</Text>
            <Pressable onPress={logOut}>
              <Text style={styles.text}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const styling = (theme: ThemeType, fontSize: number) =>
  StyleSheet.create({
    appTitle: {
      fontSize: fontSize,
      textAlign: 'center',
      fontFamily: 'Inter-Bold',
      color: Colors[theme]?.textColor,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors[theme]?.themeColor,
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
      color: Colors[theme]?.textColor,
      fontSize: fontSize,
      fontFamily: 'Inter-Bold',
    },
  });
