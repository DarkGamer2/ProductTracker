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
      return <Text style={homeStyles.apiText}>API Call Was Successful</Text>;
    }
  };

  return (
    <ScrollView>
      <View style={homeStyles.topNav}>
        <Text style={homeStyles.helloText}>Hello User!</Text>
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
        <Pressable style={homeStyles.viewProductsButton}>
          <Text style={homeStyles.viewProductsButtonText}>
            View All Products
          </Text>
        </Pressable>
      </View>
    </ScrollView>
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
  },
  productContainer: {
    flexDirection: 'row',
  },
  apiText: {
    textAlign: 'center',
  },
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
