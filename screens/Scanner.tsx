import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
type ThemeType = keyof typeof Colors;

const Scanner = () => {
  const {theme} = useTheme();
  const settingsStyles = styling(theme);
  return (
    <View>
      <Text style={settingsStyles.appTitle}>Scanner</Text>
      <Text style={settingsStyles.settingsText}>Feature coming soon...</Text>
    </View>
  );
};

export default Scanner;

const styling = (theme: ThemeType) =>
  StyleSheet.create({
    appTitle: {
      textAlign: 'center',
      fontFamily: 'Inter-Bold',
      color: Colors[theme]?.textColor,
    },
    settingsText: {
      fontFamily: 'Inter-Regular',
      color: Colors[theme]?.textColor,
    },
  });
