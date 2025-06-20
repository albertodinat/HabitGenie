import React, { createContext, useContext, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

interface ThemeCtx {
  scheme: 'light' | 'dark';
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx | undefined>(undefined);

export const ThemeProviderCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = useRNColorScheme() === 'dark' ? 'dark' : 'light';
  const [scheme, setScheme] = useState<'light' | 'dark'>(system);
  const toggle = () => setScheme(prev => (prev === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{ scheme, toggle }}>{children}</ThemeContext.Provider>;
};

export const useThemeScheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeScheme must be used within ThemeProviderCustom');
  return ctx;
};
