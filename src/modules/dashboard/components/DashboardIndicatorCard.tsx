import { Card, CardContent, Typography } from '@mui/material';

interface DashboardIndicatorCardProps {
  title: string;
  value: string;
}

export function DashboardIndicatorCard({ title, value }: DashboardIndicatorCardProps) {
  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
