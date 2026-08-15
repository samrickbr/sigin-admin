const sharedColors = {
  primary: {
    main: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },

  secondary: {
    main: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
    contrastText: '#FFFFFF',
  },

  success: {
    main: '#16A34A',
    light: '#22C55E',
    dark: '#15803D',
    contrastText: '#FFFFFF',
  },

  warning: {
    main: '#D97706',
    light: '#F59E0B',
    dark: '#B45309',
    contrastText: '#FFFFFF',
  },

  error: {
    main: '#DC2626',
    light: '#EF4444',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },

  info: {
    main: '#0284C7',
    light: '#0EA5E9',
    dark: '#0369A1',
    contrastText: '#FFFFFF',
  },
};

export const lightColors = {
  ...sharedColors,

  background: {
    default: '#F5F7FA',
    paper: '#FFFFFF',
  },

  text: {
    primary: '#172033',
    secondary: '#64748B',
    disabled: '#94A3B8',
  },

  divider: '#E2E8F0',
};

export const darkColors = {
  ...sharedColors,

  background: {
    default: '#15171A',
    paper: '#1E2125',
  },

  text: {
    primary: '#F1F3F5',
    secondary: '#A1A7AE',
    disabled: '#6F767D',
  },

  divider: '#30343A',
};

export const colors = darkColors;
