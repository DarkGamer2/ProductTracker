// App.js
import React, {useEffect, useCallback} from 'react';
import {useColorScheme} from 'react-native';
import {save, get} from './context/theme/storage';
import {ThemeProvider, useTheme} from './context/theme/ThemeContext';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import StackNavigator from './components/StackNavigator';
import { FontProvider } from './context/fontContext';

const AppContent = () => {
  const appearance = useColorScheme();
  const {theme, setTheme} = useTheme();

  const setAppTheme = useCallback(async () => {
    const IS_FIRST = await get('IS_FIRST');
    if (IS_FIRST === null) {
      save('Theme', appearance);
      save('IsDefault', true);
      save('IS_FIRST', true);
      setTheme(appearance === 'dark' ? 'dark' : 'light'); // Ensure 'light' or 'dark' is passed
    }
  }, [appearance, setTheme]);
  

  useEffect(() => {
    setAppTheme();
  }, [setAppTheme]);

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
    <StackNavigator/>
    </NavigationContainer>
  );
};

const App = () => (
 <FontProvider>
   <ThemeProvider>
    <AppContent />
  </ThemeProvider>
 </FontProvider>
);

export default App;
