import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Settings from '../screens/Settings';
import AddProduct from '../screens/AddProduct';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Scanner from '../screens/Scanner';
import {colors} from '../constants/colors';
import { fonts } from '../constants/fonts';
const Navbar = ({user}) => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.purple,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: navStyles.label,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        user={user}
      />
      <Tab.Screen
        name="Add Product"
        component={AddProduct}
        options={{
          tabBarLabel: 'Add Product',
          tabBarLabelStyle: navStyles.label,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="add-circle" color={color} size={size} />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={Scanner}
        options={{
          tabBarLabel: 'Scanner',
          tabBarLabelStyle: navStyles.label,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="qrcode" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarLabelStyle: navStyles.label,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navbar;

const navStyles = StyleSheet.create({
  label: {
    fontFamily:`Lato-Italic`,
    fontSize: 12,
  },
});
