import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../auth/store/authStore';
import { useThemeMode } from '../../styles/ThemeContext';

export function Header() {
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();

  const usuario = useAuthStore((state) => state.usuario);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 64,
        px: 3,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        SIGIN Administrativo
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {usuario?.pessoa.nome} ({usuario?.perfis.map((perfil) => perfil.nome).join(', ')})
        </Typography>

        <Tooltip title={mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}>
          <IconButton onClick={toggleMode} aria-label="Alternar tema">
            {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
        </Tooltip>

        <Button variant="outlined" onClick={handleLogout}>
          Sair
        </Button>
      </Box>
    </Box>
  );
}
