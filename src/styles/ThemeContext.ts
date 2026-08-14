import { createContext, useContext } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useThemeMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }

  return context;
}
