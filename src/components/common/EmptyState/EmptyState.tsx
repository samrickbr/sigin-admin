import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'Nenhum registro encontrado' }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 1,
      }}
    >
      <InboxIcon fontSize="large" />

      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
