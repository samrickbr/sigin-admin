import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../../services/queryClient';
import { ThemeProvider } from '../../styles/ThemeProvider';

interface Props {
  children: ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
