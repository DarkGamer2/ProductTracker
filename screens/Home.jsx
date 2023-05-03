import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {colors} from '../constants/colors';
const Home = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [accounts, setAccounts] = useState([]);
  return (
    <ScrollView>
      <View style={homeStyles.topNav}>
        <Text style={homeStyles.helloText}>Hello User!</Text>
        <Modal visible={modalVisible}>
          <Text>Accounts</Text>
          <Text>No Accounts To Display</Text>
          <Pressable>
            <Text>Add Account</Text>
          </Pressable>
          <FlatList
            data={accounts}
            renderItem={item => {
              return <Text>{item}</Text>;
            }}
          />
          <Pressable onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
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
        <FlatList
          keyExtractor={cafeItem => cafeItem.productID}
          renderItem={cafeItem => {
            <View style={homeStyles.productContainer}>
              <Text>Product</Text>
              <Pressable>
                <MaterialIcons name="details" color={colors.purple} />
              </Pressable>
            </View>;
          }}
        />
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
});
