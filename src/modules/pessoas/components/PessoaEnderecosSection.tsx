import { Box, Button, Paper, Stack, Typography } from '@mui/material';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import { EmptyState, Feedback, Loading } from '../../../components/common';

import { usePessoaEnderecos } from '../hooks/usePessoaEnderecos';
import type { PessoaEnderecoResponse } from '../types/pessoaEndereco';

import { PessoaEnderecoCard } from './PessoaEnderecoCard';

type PessoaEnderecosSectionProps = {
  enderecosQuery: ReturnType<typeof usePessoaEnderecos>;
  onNovo: () => void;
  onEditar: (endereco: PessoaEnderecoResponse) => void;
  onDefinirPrincipal: (endereco: PessoaEnderecoResponse) => void;
  onExcluir: (endereco: PessoaEnderecoResponse) => void;
  definirPrincipalPending: boolean;
  deletePending: boolean;
};

export function PessoaEnderecosSection({
  enderecosQuery,
  onNovo,
  onEditar,
  onDefinirPrincipal,
  onExcluir,
  definirPrincipalPending,
  deletePending,
}: PessoaEnderecosSectionProps) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h6">Endereços</Typography>

          <Typography variant="body2" color="text.secondary">
            Endereços associados a esta pessoa.
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={onNovo}>
          Novo endereço
        </Button>
      </Box>

      {enderecosQuery.isLoading ? (
        <Loading />
      ) : enderecosQuery.isError ? (
        <Feedback message="Não foi possível carregar os endereços." severity="error" />
      ) : !enderecosQuery.data?.length ? (
        <EmptyState message="Nenhum endereço cadastrado." />
      ) : (
        <Stack spacing={2}>
          {enderecosQuery.data.map((endereco) => (
            <PessoaEnderecoCard
              key={endereco.id}
              endereco={endereco}
              onDefinirPrincipal={onDefinirPrincipal}
              onEditar={onEditar}
              onExcluir={onExcluir}
              disabledDefinirPrincipal={definirPrincipalPending}
              disabledExcluir={deletePending}
            />
          ))}
        </Stack>
      )}
    </Paper>
  );
}
