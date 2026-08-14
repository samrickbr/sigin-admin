import { InboxOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        minHeight: 220,
        px: 3,
        py: 4,
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      <InboxOutlined
        sx={{
          fontSize: 40,
          color: 'text.secondary',
        }}
      />

      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
