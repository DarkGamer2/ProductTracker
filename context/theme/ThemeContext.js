import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './Colors';  // Adjust this import path accordingly

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme
  const [fontSize, setFontSize] = useState(20); // Default font size

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedFontSize = await AsyncStorage.getItem('fontSize');
        if (savedTheme) setTheme(savedTheme);
        if (savedFontSize) setFontSize(parseInt(savedFontSize, 10));
      } catch (error) {
        console.error('Error loading theme and font size:', error);
      }
    };
    loadSettings();
  }, []);

  const updateFontSize = async (newFontSize) => {
    try {
      setFontSize(newFontSize);
      await AsyncStorage.setItem('fontSize', newFontSize.toString());
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, fontSize, toggleTheme, updateFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
