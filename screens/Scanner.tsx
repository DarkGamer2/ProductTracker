import React, { useState } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';

type ThemeType = keyof typeof Colors;

const Scanner = () => {
  const { theme } = useTheme();
  const scannerStyles = styling(theme);
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert('Barcode Scanned', `Barcode data: ${data}`, [
        {
          text: 'OK',
          onPress: () => {
            setScanned(false);
            addProductToAccount(data);
          },
        },
      ]);
    }
  };

  const addProductToAccount = (barcode: string) => {
    // Implement the logic to add the product to the user's account
    // For example, make an API call to your backend server
    console.log(`Adding product with barcode ${barcode} to user account`);
  };

  return (
    <View style={scannerStyles.container}>
      <RNCamera
        style={scannerStyles.camera}
        onBarCodeRead={handleBarCodeScanned}
        captureAudio={false}
      >
        <View style={scannerStyles.centered}>
          <Text style={scannerStyles.scannerText}>Scan a Barcode</Text>
        </View>
      </RNCamera>
    </View>
  );
};

export default Scanner;

const styling = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors[theme]?.backgroundColor,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  scannerText: {
    color: Colors[theme]?.textColor,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});