import { useEffect, useMemo, useState } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { ThemeContext, type ThemeMode } from './ThemeContext';
import { createAppTheme } from './theme';

const STORAGE_KEY = 'sigin-theme-mode';

function getInitialMode(): ThemeMode {
  const storedMode = localStorage.getItem(STORAGE_KEY);

  return storedMode === 'light' || storedMode === 'dark' ? storedMode : 'dark';
}

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  const muiTheme = useMemo(() => createAppTheme(mode), [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  const contextValue = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
