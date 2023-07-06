import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {colors} from '../constants/colors';

const AddProduct = () => {
  const API_URL = 'https://producttracker-api-production.up.railway.app';

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [buttonText, setButtonText] = useState('Add Product');
  const [buttonColor, setButtonColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const Product = {productName, productDescription, productPrice};
  const handleSubmit = () => {
    fetch(
      `${API_URL}/api/products/addproduct`,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Product),
      },
      setButtonText(
        <Text>
          {' '}
          <ActivityIndicator size={'small'} color={colors.white} /> Adding
          Product...
        </Text>,
      ),
      setButtonColor('#00c438'),
    );
  };
  return (
    <ScrollView>
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
        <Pressable style={formStyles.addProductButton} onPress={handleSubmit}>
          <Text style={formStyles.addButtonText}>{buttonText}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddProduct;

const formStyles = StyleSheet.create({
  textInput: {
    margin: 'auto',
    alignSelf: 'center',
    backgroundColor: colors.smokeWhite,
    width: 150,
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
  },
  addButtonText: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.white,
    fontFamily: 'BebasNeue-Regular',
    letterSpacing:1
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily:'Lato-Italic',
    margin:30,
    color:colors.darkGrayAlt2
    
  },
  addProductButton: {
    backgroundColor: colors.purple,
    padding: 10,
    width: 120,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop:40
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: 35,
    fontFamily:"BebasNeue-Regular",
    margin:20,
    color:colors.purple,
  },
});
