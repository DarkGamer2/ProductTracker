import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useTheme} from '../context/theme/ThemeContext';
import Colors from '../context/theme/Colors';
import {items} from '../data/items';
import {colors} from '../constants/colors';
import {Customer, TabItem} from '../types';
import { useFont } from '../context/fontContext';

type ThemeType = keyof typeof Colors;

const AddTab: React.FC<{navigation: any; route: any}> = ({navigation, route}) => {
  const {theme} = useTheme();
  const {fontSize}=useFont();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [tabItems, setTabItems] = useState<TabItem[]>([]);
  const [dropdownValue, setDropdownValue] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCustomers();
    if (route.params?.scannedProduct) {
      handleAddProductToTab(route.params.scannedProduct);
    }
  }, [route.params?.scannedProduct]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('https://product-tracker-api-production.up.railway.app/api/customers',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCustomers(data);
      } else {
        Alert.alert('Error', 'Failed to fetch customers');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching customers');
    }
  };

  const handleSelectCustomer = async (value: string | null) => {
    const customer = customers.find(c => c.id === value);
    setSelectedCustomer(customer || null);
    setDropdownValue(value);
    if (customer) {
      await fetchCustomerTab(customer.id);
    }
  };

  const fetchCustomerTab = async (customerId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://product-tracker-api-production.up.railway.app/api/tabs/${customerId}`,
      );
      const data = await response.json();
  
      if (response.ok && data) {
        // Existing tab found
        setTabItems(data.products || []);
        calculateTotal(data.products);
      } else {
        // No existing tab found, fallback to empty tab
        setTabItems([]);
        calculateTotal([]);
      }
    } catch (error) {
      // Handle network errors gracefully
      console.error('Error fetching customer tab:', error);
      setTabItems([]);
      calculateTotal([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProductToTab = (product: any) => {
    if (selectedCustomer) {
      const newTabItem: TabItem = {
        id: product.id.toString(),
        name: product.itemName,
        price: parseFloat(product.price),
        status: 'pending',
      };
      setTabItems(prev => {
        const updatedTab = [...prev, newTabItem];
        calculateTotal(updatedTab);
        return updatedTab;
      });
    }
  };

  const handleSetStatus = (
    index: number,
    status: 'paid' | 'pending' | 'credit',
  ) => {
    setTabItems(prev => {
      const updatedTab = prev.map((item, idx) =>
        idx === index ? {...item, status} : item,
      );
      return updatedTab;
    });
  };

  const handleDeleteProduct = (index: number) => {
    setTabItems(prev => {
      const updatedTab = prev.filter((_, idx) => idx !== index);
      calculateTotal(updatedTab);
      return updatedTab;
    });
  };

  const calculateTotal = (items: TabItem[]) => {
    const total = items.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(total);
  };

  const saveTabToServer = async () => {
    if (selectedCustomer && selectedCustomer.id) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://product-tracker-api-production.up.railway.app/api/tabs/${selectedCustomer.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({products: tabItems}),
          },
        );
        if (response.ok) {
          Alert.alert('Success', 'Tab saved successfully');
          // Send a notification to the user
          await sendNotification(
            selectedCustomer.id,
            'Your tab has been updated!',
          );
        } else {
          const error = await response.text();
          Alert.alert('Error', `Failed to save tab: ${error}`);
        }
      } catch (error: any) {
        Alert.alert(
          'Error',
          `An error occurred while saving the tab: ${error.message}`,
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Error', 'Customer ID is not defined');
    }
  };

  const sendNotification = async (customerId: string, message: string) => {
    try {
      await fetch(`https://product-tracker-api-production.up.railway.app/api/notify/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({message}),
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const tabStyles = styling(theme,fontSize);

  return (
    <SafeAreaView style={tabStyles.container}>
      <View>
        <Text style={tabStyles.appTitle}>Tab Creation</Text>
      </View>

      <View>
        <Text style={tabStyles.headerText}>Select a Customer</Text>

        <Dropdown
  style={tabStyles.dropdown}
  data={customers.map(customer => ({
    label: customer.name || customer.username || 'Unnamed Customer',
    value: customer.id,
  }))}
  labelField="label"
  valueField="value"
  placeholder="Select a Customer"
  value={dropdownValue}
  onChange={item => handleSelectCustomer(item.value)}
  containerStyle={tabStyles.dropdownContainer}
  selectedTextStyle={tabStyles.selectedTextStyle}
/>

        <View>
          <Pressable onPress={goBack} style={tabStyles.goBackButton}>
            <Text style={tabStyles.goBackButtonText}>Go Back</Text>
          </Pressable>
        </View>

        {selectedCustomer && (
          <View>
            <Text style={tabStyles.selectedCustomerText}>
              {tabItems.length > 0
                ? `Existing Tab for: ${selectedCustomer.username}`
                : `Creating New Tab for: ${selectedCustomer.username}`}
            </Text>

            <Text style={tabStyles.headerText}>Current Tab:</Text>
            {tabItems.map((tabItem, index) => (
              <View
                key={index}
                style={[
                  tabStyles.tabItem,
                  {backgroundColor: getStatusColor(tabItem.status)},
                ]}>
                <Text style={tabStyles.tabItemText}>
                  {tabItem.name} - {tabItem.status} - $
                  {tabItem.price.toFixed(2)}
                </Text>
                <View style={tabStyles.statusButtons}>
                  <Button
                    title="Mark as Paid"
                    onPress={() => handleSetStatus(index, 'paid')}
                  />
                  <Button
                    title="Set as Credit"
                    color="red"
                    onPress={() => handleSetStatus(index, 'credit')}
                  />
                  <Button
                    title="Set as Pending"
                    color="orange"
                    onPress={() => handleSetStatus(index, 'pending')}
                  />
                </View>
                <Button
                  title="Delete"
                  color="red"
                  onPress={() => handleDeleteProduct(index)}
                />
              </View>
            ))}

            <Text style={tabStyles.totalPriceText}>
              Total Price: ${totalPrice.toFixed(2)}
            </Text>

            <Text style={tabStyles.headerText}>Add More Products:</Text>
            <Dropdown
              style={tabStyles.dropdown}
              data={items.map(item => ({
                label: item.itemName,
                value: item.id.toString(),
              }))}
              labelField="label"
              valueField="value"
              placeholder="Select a Product"
              value={selectedProduct?.id}
              onChange={item => {
                const selected = items.find(
                  product => product.id.toString() === item.value,
                );
                setSelectedProduct(selected);
                handleAddProductToTab(selected);
              }}
              containerStyle={tabStyles.dropdownContainer}
              selectedTextStyle={tabStyles.selectedTextStyle}
            />

            <Pressable
              style={tabStyles.saveTabButton}
              onPress={saveTabToServer}>
              <Text style={tabStyles.saveTabButtonText}>Save Tab</Text>
            </Pressable>

            <Pressable style={tabStyles.goBackButton} onPress={goBack}>
              <Text style={tabStyles.goBackButtonText}>Go Back</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddTab;

const getStatusColor = (status: 'paid' | 'pending' | 'credit') => {
  switch (status) {
    case 'paid':
      return 'green';
    case 'credit':
      return 'red';
    case 'pending':
      return 'orange';
    default:
      return 'white';
  }
};

const styling = (theme: ThemeType,fontSize:any) =>
  StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    headerText: {
      fontSize: fontSize,
      fontWeight: 'bold',
      marginVertical: 10,
      color: Colors[theme]?.textColor,
    },
    customerText: {
      fontSize: fontSize,
      color: Colors[theme]?.textColor,
    },
    selectedCustomerText: {
      fontSize: fontSize,
      marginVertical: 10,
      color: Colors[theme]?.textColor,
    },
    productText: {
      fontSize: 16,
      color: Colors[theme]?.textColor,
    },
    tabItem: {
      marginVertical: 10,
      padding: 10,
      borderRadius: 5,
    },
    tabItemText: {
      fontSize: fontSize,
      color: 'white',
    },
    statusButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    appTitle: {
      textAlign: 'center',
      fontSize: fontSize,
      fontFamily: 'BebasNeue-Regular',
      margin: 20,
      color: colors.purple,
    },
    dropdown: {
      height: 50,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
    },
    dropdownContainer: {
      backgroundColor: '#fff',
      borderRadius: 12,
      maxHeight: 200, // Make dropdown scrollable
    },
    selectedTextStyle: {
      fontSize: fontSize,
      color: Colors[theme]?.textColor,
    },
    saveTabButton: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    saveTabButtonText: {
      textAlign: 'center',
      fontSize: fontSize,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    goBackButton: {
      backgroundColor: colors.pink,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
      textAlign: 'center'
    },
    goBackButtonText: {
      textAlign: 'center',
      fontSize: fontSize,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    totalPriceText: {
      fontSize: fontSize,
      color: Colors[theme].textColor,
      textAlign: 'center',
      marginVertical: 16,
    },
  });