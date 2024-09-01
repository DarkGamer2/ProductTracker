import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Modal,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Item from '../components/Item';
import {items} from '../data/items';
import {colors} from '../constants/colors';
import {useTheme} from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';

type ThemeType = keyof typeof Colors;

const Home = ({route, navigation}: any) => {
  const {theme} = useTheme();
  const username = route && route.params && route.params.username;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Function to render each product item
  const renderGridItem = ({item}: any) => (
    <View
      style={[
        styles.itemContainer,
        {width: (Dimensions.get('window').width - 40) / 3},
      ]}>
      <Image source={item.itemImage} style={styles.itemImage} />
      <Text style={styles.productName}>{item.itemName}</Text>
    </View>
  );

  // Function to render each item in the modal
  const renderModalItem = ({item}: any) => (
    <Item title={item.itemName} image={item.itemImage} price={item.price} />
  );

  const styles = styling(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome To <Text style={styles.appTitle}>Product Tracker</Text>
      </Text>
      <Text style={styles.welcomeText}>
        Hello <Text style={styles.usernameText}>{username}</Text>
      </Text>

      {/* Grid displaying the first 6 items */}
      <FlatList
        data={items.slice(0, 6)} // Limit to first 6 items
        renderItem={renderGridItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3} // 3 items per row
        columnWrapperStyle={styles.row} // Align items in rows
        contentContainerStyle={styles.flatListContainer}
      />

      <Pressable
        style={styles.viewProductsButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.viewProductsButtonText}>View All Products</Text>
      </Pressable>

      {/* Modal to display all products */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>All Products</Text>

            {/* Display all products in the modal */}
            <FlatList
              data={items}
              renderItem={renderModalItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.modalFlatListContainer}
            />

            <Pressable
              style={styles.buttonClose}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>
                <MaterialCommunityIcons name="close" size={20} /> Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View>
        <Pressable
          onPress={() => navigation.navigate('AddCustomer')}
          style={styles.addCustomerButton}>
          <Text style={styles.addCustomerText}>Add Customer</Text>
        </Pressable>
      </View>
      <View>
        <Pressable
          style={styles.addTabButton}
          onPress={() => navigation.navigate('AddTab')}>
          <Text style={styles.addTabButtonText}>
            <MaterialIcons name="add-circle-outline" size={20} /> Add A Tab
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styling = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    welcomeText: {
      textAlign: 'center',
      fontSize: 15,
      color: Colors[theme]?.textColor,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    appTitle: {
      fontSize: 30,
      textAlign: 'center',
      marginTop: 35,
      fontFamily: 'BebasNeue-Regular',
      color: colors.purple,
    },
    flatListContainer: {
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    itemContainer: {
      marginBottom: 10,
      alignItems: 'center',
    },
    itemImage: {
      width: 100,
      height: 100,
      marginBottom: 5,
    },
    row: {
      justifyContent: 'space-between', // Ensure spacing between the columns
      marginBottom: 15, // Add space between rows
    },
    viewProductsButton: {
      backgroundColor: colors.purple,
      padding: 15,
      borderRadius: 10,
      width: 150,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 20,
    },
    viewProductsButtonText: {
      color: colors.white,
      textAlign: 'center',
      fontSize: 18,
      fontFamily: 'BebasNeue-Regular',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: Colors[theme]?.backgroundColor,
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
      width: '100%',
      height: '100%',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: colors.purple,
    },
    modalFlatListContainer: {
      flexGrow: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonClose: {
      backgroundColor: colors.red,
      width: 120,
      alignSelf: 'center',
      marginBottom: 12,
      borderRadius: 8,
      padding: 10,
    },
    textStyle: {
      textAlign: 'center',
      color: Colors[theme]?.textColor,
    },
    usernameText: {
      color: colors.purple,
    },
    addTabButton: {
      backgroundColor: colors.blue,
      padding: 15,
      borderRadius: 10,
      width: 150,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 20,
    },
    addTabButtonText: {
      color: colors.white,
      textAlign: 'center',
      fontSize: 15,
      fontFamily: 'BebasNeue-Regular',
    },
    productName: {
      color: Colors[theme]?.textColor,
    },
    addCustomerText: {
      color: Colors[theme]?.textColor,
      fontSize: 15,
      fontFamily: 'BebasNeue-Regular',
      textAlign: 'center',
    },
    addCustomerButton: {
      backgroundColor: colors.orange,
      padding: 15,
      borderRadius: 10,
      width: 150,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 20,
      marginBottom: 10,
      fontSize: 15,
      fontFamily: 'BebasNeue-Regular',
    },
  });
