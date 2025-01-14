import {StyleSheet} from 'react-native';
import React, { useContext } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import AddProduct from '../screens/AddProduct';
import Settings from '../screens/Settings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Scanner from '../screens/Scanner';
import {colors} from '../constants/colors';
import { useTheme } from '../context/theme/ThemeContext';  // Import ThemeContext
import { useFont } from '../context/fontContext';  // Import FontContext

const BottomTabNavigator = ({user}: any) => {
  const Tab = createBottomTabNavigator();

  // Access the current theme and font size from the contexts
  const { theme } = useTheme();
  const { fontSize } = useFont();

  // Apply dynamic styling based on the current theme and font size
  const navStyles = StyleSheet.create({
    label: {
      fontSize: fontSize, // Apply font size dynamically
      fontFamily: 'BebasNeue-Regular',  // You can change this based on the theme or context
      color: theme === 'dark' ? colors.white : colors.black,  // Adjust color based on theme
    },
  });

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: theme === 'dark' ? colors.purple : colors.purple, // Active icon color based on theme
        tabBarInactiveTintColor: theme === 'dark' ? colors.darkGray : colors.purple, // Inactive icon color based on theme
        headerShown: false,
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
        component={Settings as React.ComponentType<any>}
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

export default BottomTabNavigator;
