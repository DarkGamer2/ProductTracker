import { Text, View,StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../context/theme/ThemeContext'
import Colors from '../context/theme/Colors'
type ThemeType = keyof typeof Colors;
const Scanner = () => {
  const { theme } = useTheme();
  const scannerStyles = styling(theme);
  return (
    <View style={scannerStyles.container}>
      <Text style={scannerStyles.scannerText}>Scanner</Text>
    </View>
  )
}

export default Scanner

const styling = (theme: ThemeType) => StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: Colors[theme]?.backgroundColor,
  },
  centered: {
    alignItems: 'center',
  },
  scannerText:{
    color: Colors[theme]?.textColor,
    fontSize: 20,
    fontWeight: 'bold',
  }
});