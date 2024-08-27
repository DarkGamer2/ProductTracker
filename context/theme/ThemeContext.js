import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {useColorScheme} from 'react-native';
import {get, save} from '../theme/storage';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState(systemTheme);

  const themeOperations = useCallback(
    async theme => {
      switch (theme) {
        case 'dark':
          setTheme('dark');
          await save('Theme', 'dark');
          await save('IsDefault', false);
          break;
        case 'light':
          setTheme('light');
          await save('Theme', 'light');
          await save('IsDefault', false);
          break;
        case 'default':
          setTheme(systemTheme);
          await save('Theme', systemTheme);
          await save('IsDefault', true);
          break;
      }
    },
    [systemTheme],
  );

  const getAppTheme = useCallback(async () => {
    const savedTheme = await get('Theme');
    const isDefault = await get('IsDefault');
    if (isDefault) {
      setTheme(systemTheme);
    } else {
      setTheme(savedTheme);
    }
  }, [systemTheme]);

  useEffect(() => {
    getAppTheme();
  }, [getAppTheme]);

  return (
    <ThemeContext.Provider value={{theme, setTheme: themeOperations}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
