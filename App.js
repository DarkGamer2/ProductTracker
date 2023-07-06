import 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text} from 'react-native';
import React from 'react';
import Login from './screens/Login';
import Navbar from './components/Navbar';
import {NavigationContainer} from '@react-navigation/native';
import AllProducts from './screens/AllProducts';
import Register from "./screens/Register";
export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Navbar" component={Navbar} />
        <Stack.Screen name="AllProducts" component={AllProducts} />
        <Stack.Screen name="Register" component={Register}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
