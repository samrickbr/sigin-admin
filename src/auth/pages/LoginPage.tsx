import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, TextField, Box, Paper, Typography } from '@mui/material';

import { login } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [loginUsuario, setLoginUsuario] = useState('');
  const [senha, setSenha] = useState('');

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      setErro('');

      const response = await login({
        login: loginUsuario,
        senha,
      });

      setAuth(response.token, null);

      navigate('/dashboard');
    } catch {
      setErro('Usuário ou senha inválidos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper
        sx={{
          padding: 4,
          width: 350,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3 }}>
          SIGIN
        </Typography>

        <TextField
          fullWidth
          label="Login"
          margin="normal"
          value={loginUsuario}
          onChange={(e) => setLoginUsuario(e.target.value)}
        />

        <TextField
          fullWidth
          label="Senha"
          type="password"
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && (
          <Typography color="error" sx={{ mt: 2 }}>
            {erro}
          </Typography>
        )}

        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </Paper>
    </Box>
  );
}
