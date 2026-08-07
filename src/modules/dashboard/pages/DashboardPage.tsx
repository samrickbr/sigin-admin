import { Box, Grid, Typography } from '@mui/material';
import { DashboardIndicatorCard } from '../components/DashboardIndicatorCard';
import { useDashboard } from '../hooks/useDashboard';
import { Loading } from '../../../components/common/Loading';
import { EmptyState } from '../../../components/common/EmptyState';
import { Feedback } from '../../../components/common/Feedback';

export default function DashboardPage() {
  const { data: indicators = [], isLoading, isError } = useDashboard();

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <Feedback severity="error" message="Não foi possível carregar os indicadores do Dashboard." />
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Dashboard
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Painel administrativo do SIGIN.
      </Typography>

      {indicators.length === 0 ? (
        <EmptyState message="Nenhum indicador disponível." />
      ) : (
        <Grid container spacing={3}>
          {indicators.map((indicator) => (
            <Grid key={indicator.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <DashboardIndicatorCard title={indicator.title} value={indicator.value} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
