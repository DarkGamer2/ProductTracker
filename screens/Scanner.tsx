import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Colors from '../context/theme/Colors';
import { useTheme } from '../context/theme/ThemeContext';
type ThemeType = keyof typeof Colors;
const Scanner = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<{ barcode: string; name: string } | null>(null);

  const {theme}=useTheme();
  const scannerStyles = styling(theme);
  const addProductToAccount = async (event: { data: string }) => {
    const barcode = event.data;
    try {
      const response = await fetch(`https://product-tracker-api-production.up.railway.app/api/products/${barcode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const product = await response.json();
        setScannedProduct(product);
        setModalVisible(true);
      } else {
        console.log(`Product with barcode ${barcode} not found`);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const confirmAddProduct = async () => {
    if (!scannedProduct) {
      console.error('No product to add');
      return;
    }
    try {
      const response = await fetch(`https://product-tracker-api-production.up.railway.app/api/products/${scannedProduct.barcode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barcode: scannedProduct.barcode,
        }),
      });

      if (response.ok) {
        console.log(`Added product with barcode ${scannedProduct.barcode} to user account`);
      } else {
        console.log('Failed to add product to user account');
      }
    } catch (error) {
      console.error('Error adding product to account:', error);
    } finally {
      setModalVisible(false);
      setScannedProduct(null);
    }
  };

  return (
    <View style={scannerStyles.container}>
      {/* Your scanner component and logic here */}
      <RNCamera
        style={scannerStyles.camera}
        onBarCodeRead={addProductToAccount}
        captureAudio={false}
      >
        <View style={scannerStyles.centered}>
          <Text style={scannerStyles.scannerText}>Scan a Barcode</Text>
        </View>
      </RNCamera>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={scannerStyles.modalView}>
          <Text>Do you want to add {scannedProduct?.name} to your account?</Text>
          <Button title="Yes" onPress={confirmAddProduct} />
          <Button title="No" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styling = (theme: ThemeType) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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

export default Scanner;