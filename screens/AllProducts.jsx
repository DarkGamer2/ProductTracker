import {StyleSheet, Text, View,FlatList,Image, Pressable,ScrollView} from 'react-native';
import React from 'react';
import { Products } from '../Data/Products';
import { colors } from '../constants/colors';
const AllProducts = ({navigation}) => {
  const closeScreen=()=>{
    navigation.navigate('Navbar')
  }
  return (
 <ScrollView>
     <View>
      <Text style={productStyles.screenTitle}>All Products</Text>
      <FlatList
              data={Products}
              renderItem={product=>{
                return(
                  <View style={productStyles.productContainer}>
                    <Image style={productStyles.productImage} source={{uri:product.item.productImage}} />
                    <Text style={productStyles.productName}>{product.item.productName}</Text>
                    <Text style={productStyles.productPrice}>{product.item.productPrice}</Text>
              
                  </View>
                )
              }}
            />
    </View>
     <Pressable style={productStyles.closeButton} onPress={closeScreen}>
     <Text style={productStyles.closeButtonText}>Close</Text>
   </Pressable>
 </ScrollView>
  );
};

export default AllProducts;

const productStyles = StyleSheet.create({
  screenTitle:{
    fontSize:35,
    color:colors.purple,
    fontFamily:"BebasNeue-Regular",
    textAlign:"center"
  },
  closeButton: {
    backgroundColor: colors.red,
    width: 120,
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 8,
    padding: 10,
  },
  closeButtonText: {
    textAlign: 'center',
    color: colors.white,
  },
  productImage:{
    width:100,
    height:100
  },
  productName:{
    color:colors.black,
  },
  productPrice:{
    color:colors.black
  },
  productContainer:{
      flexDirection:"row",
      justifyContent:"space-evenly",
      alignItems:"center"
    }
});
