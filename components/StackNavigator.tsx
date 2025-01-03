import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import BottomTabNavigator from './BottomTabNavigator';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import AddTab from '../screens/AddTab';
import AddCustomer from '../screens/AddCustomer';
import Profile from '../screens/Profile';
import Feedback from '../screens/Feedback';
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Register" component={Register} options={{headerShown:false}}/>
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown:false}}/>
      <Stack.Screen name="AddTab" component={AddTab} options={{headerShown:false}}/>
      <Stack.Screen name="AddCustomer" component={AddCustomer} options={{headerShown:false}}/>
      <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
      <Stack.Screen name="Feedback" component={Feedback} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
};

export default StackNavigator;
