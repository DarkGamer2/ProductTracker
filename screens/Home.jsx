import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { Products } from '../Data/Products';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useState, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {colors} from '../constants/colors';
const Home = ({navigation, user}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState('');
  const [products, setProducts] = useState([]);

  const API_URL = 'https://producttracker-api-production.up.railway.app';

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(
        result => {
          setIsLoading(false), setProducts(result);
        },
        error => {
          setIsLoading(false), setError(error);
        },
      );
  }, []);

  const getProducts = () => {
    if (isLoading == true) {
      return <ActivityIndicator size={'large'} color={'blue'} />;
    } else {
      console.log(products);
      return(
        <View>
         <FlatList data={Products.slice(0,3)} renderItem={cafeitem=>{
          return(
            <View style={homeStyles.productContainer}>
              <Image style={homeStyles.productImage} source={{uri:`${cafeitem.item.productImage}`}}/>
              
            </View>
          )
         }}/>
        </View>
      )
    }
  };

  return (
    <View>
      <View style={homeStyles.topNav}>
        <Text style={homeStyles.helloText}>{`Hello ${user}!`}</Text>
        <Modal visible={modalVisible}>
          <Text style={modalStyles.modalTitle}>Accounts</Text>
          <Text style={modalStyles.noAccountText}>No Accounts To Display</Text>
          <Pressable style={modalStyles.addAccountButton}>
            <Text style={modalStyles.addAccountButtonText}>Add Account</Text>
          </Pressable>
          <FlatList
            data={accounts}
            renderItem={item => {
              return <Text>{item}</Text>;
            }}
          />
          <Pressable
            style={modalStyles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={modalStyles.closeButtonText}>Close</Text>
          </Pressable>
        </Modal>
        <Pressable onPress={() => setModalVisible(true)}>
          <MaterialIcons
            name="add-circle"
            color={colors.blue}
            style={homeStyles.addButtonIcon}
          />
        </Pressable>
      </View>
      <View>
        <Text style={homeStyles.productText}>Products</Text>
        <View>{getProducts()}</View>
        <Pressable style={homeStyles.viewProductsButton} onPress={()=>navigation.navigate('AllProducts')}>
          <Text style={homeStyles.viewProductsButtonText}>
            View All Products
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const homeStyles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productText: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily:"BebasNeue-Regular",
    letterSpacing:2,
    color: colors.purple
  },
  viewProductsButton: {
    backgroundColor: colors.purple,
    padding: 15,
    borderRadius: 10,
    width: 150,
    marginLeft: 100,
    marginTop: 20,
  },
  viewProductsButtonText: {
    color: colors.white,
    textAlign: 'center',
  },
  addButtonIcon: {
    fontSize: 40,
  },
  helloText: {
    fontSize: 30,
    fontFamily:"Roboto-Regular",
    color:colors.black
  },
  productContainer: {
    flexDirection:"row",
    justifyContent:"space-evenly",
    alignItems:"center"
    
  },
  apiText: {
    textAlign: 'center',
  },
  productImage:{
    width: 100,
        height: 100,
        borderRadius: 6,
  }
});

const modalStyles = StyleSheet.create({
  modalTitle: {
    fontSize: 30,
    textAlign: 'center',
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
  addAccountButton: {
    backgroundColor: colors.purple,
    width: 120,
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
  },
  addAccountButtonText: {
    textAlign: 'center',
    color: colors.white,
  },
  noAccountText: {
    textAlign: 'center',
  },
 
});
