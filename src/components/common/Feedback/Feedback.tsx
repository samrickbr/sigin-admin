import Alert from '@mui/material/Alert';

interface FeedbackProps {
  severity?: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export function Feedback({ severity = 'info', message }: FeedbackProps) {
  return <Alert severity={severity}>{message}</Alert>;
}
