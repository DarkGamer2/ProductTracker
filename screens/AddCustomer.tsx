import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  StyleSheet,
  Pressable,
} from 'react-native';
import {colors} from '../constants/colors';
import Colors from '../context/theme/Colors';
import {useTheme} from '../context/theme/ThemeContext';

type ThemeType = keyof typeof Colors;
const AddCustomer = ({navigation}: any) => {
  const {theme,fontSize} = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddCustomer = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a customer name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a customer email');
      return;
    }

    try {
      const response = await fetch('https://product-tracker-api-production.up.railway.app/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, phone}),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Customer added successfully');
        navigation.navigate('AddTab'); // Navigate to the AddTab screen
      } else {
        Alert.alert('Error', data.message || 'Failed to add customer');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the customer');
    }
  };

  const customerStyles = styling(theme,fontSize);
  return (
    <SafeAreaView style={customerStyles.container}>
      <Text style={customerStyles.appTitle}>Add A Customer</Text>
      <View style={customerStyles.centered}>
        <Text style={customerStyles.label}>Enter Customer Name:</Text>
        <TextInput
          style={customerStyles.input}
          value={name}
          onChangeText={setName}
          placeholder="Customer Name"
        />

        <Text style={customerStyles.label}>Enter Customer Email:</Text>
        <TextInput
          style={customerStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Customer Email"
          keyboardType="email-address"
        />

        <Text style={customerStyles.label}>Enter Customer Phone:</Text>
        <TextInput
          style={customerStyles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Customer Phone"
          keyboardType="phone-pad"
        />
      </View>

      <View style={customerStyles.centered}>
        <Pressable
          onPress={handleAddCustomer}
          style={customerStyles.addCustomerButton}>
          <Text style={customerStyles.addCustomerButtonText}>Add Customer</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.goBack()}
          style={customerStyles.goBackButton}>
          <Text style={customerStyles.goBackButtonText}>Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AddCustomer;

const styling = (theme: ThemeType,fontSize:any) =>
  StyleSheet.create({
    container: {
      padding: 20,
      flex: 1,
      backgroundColor: Colors[theme]?.backgroundColor,
    },
    label: {
      fontSize: fontSize,
      marginBottom: 10,
      color: Colors[theme]?.textColor,
      textAlign: 'center',
      fontFamily: 'Lato-Italic',
    },
    input: {
      color: Colors[theme]?.textColor,
      width: 200,
      marginBottom: 20,
      borderRadius: 8,
      padding: 8,
      borderWidth: 1,
      borderColor: colors.purple,
    },
    addCustomerButton: {
      backgroundColor: colors.purple,
      padding: 10,
      width: 160,
      borderRadius: 8,
      marginTop: 25,
    },
    addCustomerButtonText: {
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
    },
    goBackButtonText: {
      textAlign: 'center',
      fontSize: fontSize,
      color: colors.white,
      fontFamily: 'BebasNeue-Regular',
      letterSpacing: 3,
    },
    appTitle: {
      textAlign: 'center',
      fontSize: fontSize,
      fontFamily: 'BebasNeue-Regular',
      margin: 20,
      color: colors.purple,
    },
    centered: {
      alignItems: 'center',
    },
  });
