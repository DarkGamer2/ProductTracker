import {StyleSheet, Text, View, Switch, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../constants/colors';
const Settings = () => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const toggleSwitch = () =>
    setDarkModeEnabled(previousState => !previousState);
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
  }
});
