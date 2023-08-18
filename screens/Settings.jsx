import {StyleSheet, Text, View, Switch, ScrollView, Pressable} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../constants/colors';
const Settings = ({navigation}) => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const toggleSwitch = () =>
    setDarkModeEnabled(previousState => !previousState);

    const handleLogout=()=>{
      navigation.navigate("Login")
    }
  return (
    <View>
      <Text style={settingStyles.screenTitle}>Settings</Text>
      <ScrollView>
        <View style={settingStyles.itemRow}>
          <Text style={settingStyles.settingTitle}>Dark Mode</Text>
          <Switch
            trackColor={{false: '#767577', true: `${colors.purple}`}}
            thumbColor={darkModeEnabled ? `${colors.white}` : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={darkModeEnabled}
          />
        </View>
        <View style={settingStyles.buttonContainer}>
        <Pressable style={settingStyles.logoutButton} onPress={handleLogout}>
          <Text style={settingStyles.logoutButtonText}>Logout</Text>
        </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;

const settingStyles = StyleSheet.create({
  screenTitle: {
    textAlign: 'center',
    fontSize: 35,
    color:colors.purple,
    fontFamily:"BebasNeue-Regular",
    margin:20
  },
  itemRow: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  settingTitle:{
    color:colors.black
  },
  logoutButton: {
    backgroundColor: colors.red,
    padding: 10,
    width: 160,
    alignSelf: 'center',
    borderRadius: 8,
    margin: 10,
  },
  logoutButtonText: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.white,
    fontFamily: 'BebasNeue-Regular',
    letterSpacing:3,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    width: 50,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
