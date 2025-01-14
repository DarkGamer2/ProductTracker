import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for the font context
interface FontContextType {
  fontSize: number;  // Font size can be any number
  updateFontSize: (newFontSize: number) => void; // Function to update font size
}

// Create a context with default value as `undefined`
const FontContext = createContext<FontContextType | undefined>(undefined);

interface FontProviderProps {
  children: ReactNode; // Type the `children` prop to accept any React component
}

export const FontProvider = ({ children }: FontProviderProps) => {
  const [fontSize, setFontSize] = useState<number>(20); // Default font size is 20

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedFontSize = await AsyncStorage.getItem('fontSize');
        if (savedFontSize) setFontSize(parseInt(savedFontSize, 10)); // Set the font size if saved
      } catch (error) {
        console.error('Error loading font size:', error);
      }
    };
    loadSettings();
  }, []);

  const updateFontSize = async (newFontSize: number) => {
    setFontSize(newFontSize); // Update the font size in state
    try {
      await AsyncStorage.setItem('fontSize', newFontSize.toString()); // Save to AsyncStorage
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  return (
    <FontContext.Provider value={{ fontSize, updateFontSize }}>
      {children}
    </FontContext.Provider>
  );
};

// Custom hook to use the font context
export const useFont = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
