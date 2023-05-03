import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import {Pressable} from 'react-native';
import {colors} from '../constants/colors';
const Login = ({navigation}) => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.appTitle}>Product Tracker</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.loginButton}
          onPress={() => navigation.navigate('Navbar')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 24,
    textAlign: 'center',
  },

  loginButton: {
    backgroundColor: colors.purple,
    borderRadius: 5,
    width: 100,
    height: 20,
    padding: 20,
  },
  loginButtonText: {
    color: colors.white,
    textAlign: 'center',
    position: 'absolute',
  },
  buttonContainer: {
    width: 50,
    textAlign: 'center',
  },
});
