import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Pressable,
} from 'react-native';
import { colors } from '../constants/colors';

const AddCustomer = ({ navigation }:any) => {
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
      const response = await fetch('http://10.0.2.2:4040/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Customer Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Customer Name"
      />

      <Text style={styles.label}>Enter Customer Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Customer Email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Enter Customer Phone:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Customer Phone"
        keyboardType="phone-pad"
      />

      <Button title="Add Customer" onPress={handleAddCustomer} />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.goBackText}>Go Back</Text>
      </Pressable>
    </View>
  );
};

export default AddCustomer;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    color: colors.white,
  },
  goBackText: {
    color: colors.white,
  },
});
