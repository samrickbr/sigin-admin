import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h3">403</Typography>

      <Typography variant="h5">
        Acesso negado
      </Typography>

      <Typography color="text.secondary">
        Você não possui permissão para acessar este recurso.
      </Typography>

      <Button variant="contained" onClick={() => navigate('/dashboard')}>
        Voltar ao dashboard
      </Button>
    </Box>
  );
}