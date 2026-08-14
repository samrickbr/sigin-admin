import { createTheme, type PaletteMode } from '@mui/material/styles';

import { darkColors, lightColors, radius, typography } from './';

export function createAppTheme(mode: PaletteMode) {
  const colors = mode === 'light' ? lightColors : darkColors;

  return createTheme({
    palette: {
      mode,

      primary: colors.primary,
      secondary: colors.secondary,

      background: colors.background,
      text: colors.text,

      success: colors.success,
      warning: colors.warning,
      error: colors.error,

      divider: colors.divider,
    },

    typography,

    shape: {
      borderRadius: radius.md,
    },

    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: radius.md,
            minHeight: 40,
            paddingInline: 20,
          },
        },
      },

      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          fullWidth: true,
          size: 'small',
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.lg,
          },
        },
      },

      MuiAlert: {
        defaultProps: {
          variant: 'filled',
        },
      },

      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
          },
        },
      },
    },
  });
}

export const theme = createAppTheme('dark');
