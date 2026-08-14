import { Box, CircularProgress } from '@mui/material';

export function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 240,
        width: '100%',
      }}
    >
      <CircularProgress size={32} />
    </Box>
  );
}
