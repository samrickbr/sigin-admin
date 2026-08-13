import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import axios from 'axios';

import { useDeleteLocal, useLocais } from '../hooks/useLocais';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';

import type { LocalResponse } from '../types/locais';

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData;
    }

    if (
      responseData &&
      typeof responseData === 'object' &&
      'message' in responseData &&
      typeof responseData.message === 'string'
    ) {
      return responseData.message;
    }
  }

  return 'Não foi possível realizar a operação com o local.';
}

export default function LocaisListPage() {
  const navigate = useNavigate();

  const locaisQuery = useLocais();
  const deleteMutation = useDeleteLocal();

  const [localParaExcluir, setLocalParaExcluir] = useState<LocalResponse | null>(null);

  const locais = useMemo(() => locaisQuery.data ?? [], [locaisQuery.data]);

  const handleExcluir = async () => {
    if (!localParaExcluir) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(localParaExcluir.id);
      setLocalParaExcluir(null);
    } catch {
      // O erro é apresentado através do estado da mutação.
    }
  };

  if (locaisQuery.isLoading) {
    return <Loading />;
  }

  if (locaisQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar os locais." />;
  }

  const mutationError = deleteMutation.error;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h4">Locais</Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton onClick={() => locaisQuery.refetch()} disabled={locaisQuery.isFetching}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/locais/novo')}
          >
            Novo local
          </Button>
        </Box>
      </Box>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity="error" message={getErrorMessage(mutationError)} />
        </Box>
      )}

      {locais.length === 0 ? (
        <EmptyState message="Nenhum local encontrado." />
      ) : (
        <DataTable
          columns={[
            {
              id: 'nome',
              field: 'nome' as keyof LocalResponse,
              label: 'Nome',
            },
            {
              id: 'ativo',
              field: 'ativo' as keyof LocalResponse,
              label: 'Situação',
              renderCell: (local: LocalResponse) => (
                <Chip
                  size="small"
                  label={local.ativo ? 'Ativo' : 'Inativo'}
                  color={local.ativo ? 'success' : 'default'}
                />
              ),
            },
            {
              id: 'acoes',
              label: 'Ações',
              renderCell: (local: LocalResponse) => (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                  }}
                >
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => navigate(`/locais/${local.id}`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setLocalParaExcluir(local)}
                      disabled={deleteMutation.isPending}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            },
          ]}
          rows={locais}
          emptyMessage="Nenhum local encontrado."
        />
      )}

      <ConfirmDialog
        open={localParaExcluir !== null}
        title="Excluir local"
        message={
          localParaExcluir ? `Deseja realmente excluir o local "${localParaExcluir.nome}"?` : ''
        }
        onConfirm={handleExcluir}
        onCancel={() => setLocalParaExcluir(null)}
      />

      {deleteMutation.isPending && <Loading />}
    </Box>
  );
}
