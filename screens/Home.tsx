import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Modal, Dimensions, Image, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Item from '../components/Item';
import { colors } from '../constants/colors';
import { useTheme } from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import { useFont } from '../context/fontContext';
import { useMemo } from 'react';
type ThemeType = keyof typeof Colors;

interface Product {
  _id: string;
  productName: string;
  productImage: string;
  productPrice: number;
}

const Home = ({ route, navigation }: any) => {
  const { theme } = useTheme();
  const { fontSize } = useFont();
  const username = route?.params?.username;
  
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Debounced fetch function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://product-tracker-api-production.up.railway.app/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const styles = useMemo(()=>styling(theme, fontSize),[theme,fontSize]);
  const displayedProducts = useMemo(() => products.slice(0, 6), [products]);

  // Render product item in the grid
  const renderGridItem = useCallback(({ item }: { item: Product }) => (
    <View style={[styles.itemContainer, { width: (Dimensions.get('window').width - 40) / 3 }]}>
      <Image source={{ uri: item.productImage }} style={styles.itemImage} />
      <Text style={styles.productName}>{item.productName || "Item"}</Text>
    </View>
  ), [styles]);

  // Render product item in the modal
  const renderModalItem = useCallback(({ item }: { item: Product }) => (
    <Item title={item.productName} image={item.productImage} price={item.productPrice} />
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome To <Text style={styles.appTitle}>Product Tracker</Text>
      </Text>
      <Text style={styles.welcomeText}>
        Hello <Text style={styles.usernameText}>{username}</Text>
      </Text>

      {/* Grid displaying the first 6 products */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.purple} />
      ) : products.length > 0 ? (
        
        <FlatList
          data={displayedProducts}
          renderItem={renderGridItem}
          keyExtractor={(item: Product) => item._id.toString()}
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <Text>No products To Display</Text>
      )}

      <Pressable style={styles.viewProductsButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.viewProductsButtonText}>View All Products</Text>
      </Pressable>

      {/* Modal for viewing all products */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>All Products</Text>

            {loading ? (
              <ActivityIndicator size="large" color={colors.purple} />
            ) : (
              <FlatList
                data={products}
                renderItem={renderModalItem}
                keyExtractor={(item: Product) => item._id.toString()}
                contentContainerStyle={styles.modalFlatListContainer}
              />
            )}

            <Pressable style={styles.buttonClose} onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>
                <MaterialCommunityIcons name="close" size={20} /> Close
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Navigation buttons */}
      <View>
        <Pressable onPress={() => navigation.navigate('AddCustomer')} style={styles.addCustomerButton}>
          <Text style={styles.addCustomerText}>Add Customer</Text>
        </Pressable>
      </View>
      <View>
        <Pressable style={styles.addTabButton} onPress={() => navigation.navigate('AddTab')}>
          <Text style={styles.addTabButtonText}>
            <MaterialIcons name="add-circle-outline" size={20} /> Add A Tab
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styling = (theme: ThemeType, fontSize: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    welcomeText: {
      textAlign: 'center',
      fontSize,
      color: Colors[theme]?.textColor,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    appTitle: {
      fontSize,
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
    productName: {
      color: Colors[theme]?.textColor,
      fontSize,
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
      fontSize,
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
      width: '80%',
      height: '80%',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: colors.purple,
      fontFamily: 'BebasNeue-Regular',
      fontSize,
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
      color: colors.white,
    },
    usernameText: {
      color: colors.purple,
      fontSize,
    },
    addTabButton: {
      backgroundColor: colors.blue,
      padding: 15,
      borderRadius: 10,
      width: 150,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 20,
      marginBottom: 10,
    },
    addTabButtonText: {
      color: colors.white,
      textAlign: 'center',
      fontSize,
      fontFamily: 'BebasNeue-Regular',
    },
    addCustomerText: {
      color: colors.white,
      fontSize,
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
    },
  });
