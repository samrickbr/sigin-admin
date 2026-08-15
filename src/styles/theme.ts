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
      info: colors.info,

      divider: colors.divider,
    },

    typography,

    shape: {
      borderRadius: radius.md,
    },

    spacing: 4,

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            backgroundColor: colors.background.default,
            color: colors.text.primary,
          },

          '*': {
            boxSizing: 'border-box',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${colors.divider}`,
            boxShadow:
              mode === 'light'
                ? '0 1px 3px rgba(15, 23, 42, 0.06)'
                : '0 1px 3px rgba(0, 0, 0, 0.25)',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            backgroundImage: 'none',
          },
        },
      },

      MuiButton: {
        defaultProps: {
          variant: 'contained',
          disableElevation: true,
          size: 'small',
        },

        styleOverrides: {
          root: {
            minHeight: 36,
            paddingInline: 16,
            borderRadius: radius.md,
            textTransform: 'none',
            fontWeight: 600,
          },

          contained: {
            boxShadow: 'none',

            '&:hover': {
              boxShadow: 'none',
            },
          },

          outlined: {
            borderWidth: 1,
          },
        },
      },

      MuiIconButton: {
        defaultProps: {
          size: 'small',
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

            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.divider,
            },

            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.text.secondary,
            },

            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1,
            },
          },

          input: {
            paddingTop: 9,
            paddingBottom: 9,
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.8125rem',
          },
        },
      },

      MuiSelect: {
        defaultProps: {
          size: 'small',
        },
      },

      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginLeft: 0,
            marginRight: 0,
            fontSize: '0.75rem',
          },
        },
      },

      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            border: `1px solid ${colors.divider}`,
          },
        },
      },

      MuiTable: {
        defaultProps: {
          size: 'small',
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#F8FAFC' : '#25292E',
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: colors.divider,
            padding: '9px 12px',
            fontSize: '0.8125rem',
          },

          head: {
            fontWeight: 700,
            color: colors.text.secondary,
            fontSize: '0.75rem',
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor:
                mode === 'light' ? 'rgba(37, 99, 235, 0.035)' : 'rgba(59, 130, 246, 0.06)',
            },
          },
        },
      },

      MuiChip: {
        defaultProps: {
          size: 'small',
        },

        styleOverrides: {
          root: {
            borderRadius: radius.sm,
            fontWeight: 600,
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: radius.lg,
            backgroundImage: 'none',
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: radius.md,
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: radius.md,
            marginTop: 4,
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            minHeight: 36,
            fontSize: '0.8125rem',
            borderRadius: radius.sm,
            marginInline: 4,
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '0.75rem',
            borderRadius: radius.sm,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: colors.divider,
          },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            borderColor: colors.divider,
          },
        },
      },

      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },

        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderBottom: `1px solid ${colors.divider}`,
          },
        },
      },

      MuiToolbar: {
        styleOverrides: {
          root: {
            minHeight: '56px !important',
          },
        },
      },

      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 40,
          },
          indicator: {
            height: 2,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 40,
            paddingInline: 16,
            textTransform: 'none',
            fontSize: '0.8125rem',
            fontWeight: 600,
          },
        },
      },
    },
  });
}

export const theme = createAppTheme('dark');
