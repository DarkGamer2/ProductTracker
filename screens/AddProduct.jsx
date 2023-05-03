import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import React from 'react';
import {colors} from '../constants/colors';

const AddProduct = () => {
  return (
    <ScrollView>
      <View>
        <Text>Add Product</Text>
      </View>
      <View>
        <Text style={formStyles.formTitle}>Product Name</Text>
        <TextInput style={formStyles.textInput} />
        <Text style={formStyles.formTitle}>Product Description</Text>
        <TextInput style={formStyles.textInput} />
        <Text style={formStyles.formTitle}>Product Price</Text>
        <TextInput style={formStyles.textInput} />
        <Pressable style={formStyles.addProductButton}>
          <Text style={formStyles.addButtonText}>Add Product</Text>
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
  },
  addButtonText: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.white,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
  },
  addProductButton: {
    backgroundColor: colors.purple,
  },
});
