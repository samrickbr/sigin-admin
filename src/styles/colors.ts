const sharedColors = {
  primary: {
    main: '#1976D2',
    light: '#42A5F5',
    dark: '#1565C0',
    contrastText: '#FFFFFF',
  },

  secondary: {
    main: '#90CAF9',
    light: '#BBDEFB',
    dark: '#64B5F6',
    contrastText: '#121212',
  },

  success: {
    main: '#4CAF50',
  },

  warning: {
    main: '#FF9800',
  },

  error: {
    main: '#F44336',
  },
};

export const lightColors = {
  ...sharedColors,

  background: {
    default: '#F7F8FA',
    paper: '#FFFFFF',
  },

  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
  },

  divider: '#E0E0E0',
};

export const darkColors = {
  ...sharedColors,

  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
  },

  divider: '#2C2C2C',
};

export const colors = darkColors;
