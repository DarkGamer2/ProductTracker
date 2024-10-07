import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';
import { useState } from 'react';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

type ThemeType = keyof typeof Colors;

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState('');
  const [buttonText, setButtonText] = useState('Add Product');
  const [buttonColor, setButtonColor] = useState(colors.purple);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { theme } = useTheme();
  const Product = { productName, productDescription, productPrice, productImage };

  const handleImagePicker = () => {
    try {
      launchImageLibrary({ mediaType: 'photo' }, async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri;
          if (imageUri) {
            const base64String = await RNFS.readFile(imageUri, 'base64');
            setProductImage(base64String);
          }
        }
      });
    } catch (error) {
      console.error('Error launching image library: ', error);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setButtonText('Adding Product...');
    setButtonColor('#00c438');

    try {
      const API_URL = 'https://product-tracker-api-production.up.railway.app';
      const response = await fetch(`${API_URL}/api/products/addproduct`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Product),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      setButtonText('Product Added');
    } catch (error: any) {
      setError(error.message);
      setButtonText('Add Product');
      setButtonColor(colors.purple);
    } finally {
      setIsLoading(false);
    }
  };

  const formStyles = styling(theme);
  return (
    <ScrollView style={formStyles.container}>
      <View>
        <Text style={formStyles.screenTitle}>Add Product</Text>
      </View>
      <View>
        <Text style={formStyles.formTitle}>Product Name</Text>
        <TextInput
          style={formStyles.textInput}
          onChangeText={newProductName => setProductName(newProductName)}
          defaultValue={productName}
        />
        <Text style={formStyles.formTitle}>Product Description</Text>
        <TextInput
          style={formStyles.textInput}
          onChangeText={newProductDescription =>
            setProductDescription(newProductDescription)
          }
          defaultValue={productDescription}
        />
        <Text style={formStyles.formTitle}>Product Price</Text>
        <TextInput
          style={formStyles.textInput}
          onChangeText={newProductPrice => setProductPrice(newProductPrice)}
          defaultValue={productPrice}
        />
        <Text style={formStyles.formTitle}>Product Image</Text>
        <Pressable style={formStyles.imagePickerButton} onPress={handleImagePicker}>
          <Text style={formStyles.imagePickerButtonText}>Pick an Image</Text>
        </Pressable>
        {productImage ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${productImage}` }}
            style={formStyles.imagePreview}
          />
        ) : null}
        <Pressable
          style={[formStyles.addProductButton, { backgroundColor: buttonColor }]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={'small'} color={colors.white} />
          ) : (
            <Text style={formStyles.addButtonText}>{buttonText}</Text>
          )}
        </Pressable>
        {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
      </View>
    </ScrollView>
  );
};

export default AddProduct;

const styling = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    textInput: {
      margin: 'auto',
      alignSelf: 'center',
      color: Colors[theme]?.textColor,
      width: 150,
      marginBottom: 10,
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.purple,
    },
    addButtonText: {
      textAlign: 'center',
      fontSize: 15,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 1,
    },
    formTitle: {
      textAlign: 'center',
      fontSize: 20,
      fontFamily: 'Lato-Italic',
      margin: 30,
      color: colors.darkGrayAlt2,
    },
    addProductButton: {
      padding: 10,
      width: 120,
      alignSelf: 'center',
      borderRadius: 8,
      marginTop: 40,
    },
    screenTitle: {
      textAlign: 'center',
      fontSize: 35,
      fontFamily: 'BebasNeue-Regular',
      margin: 20,
      color: colors.purple,
    },
    errorText: {
      textAlign: 'center',
      color: 'red',
      marginTop: 10,
    },
    imagePickerButton: {
      padding: 10,
      backgroundColor: colors.purple,
      borderRadius: 8,
      alignSelf: 'center',
      marginBottom: 10,
    },
    imagePickerButtonText: {
      color: colors.white,
      textAlign: 'center',
      fontFamily: 'BebasNeue-Regular'
    },
    imagePreview: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginTop: 10,
    },
  });