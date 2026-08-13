import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import { Add as AddIcon, Edit as EditIcon, Refresh as RefreshIcon } from '@mui/icons-material';

import { usePermissoes } from '../hooks/usePermissoes';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';

import type { PermissaoResponse } from '../types/perfilPermissoes';

export default function PermissoesListPage() {
  const navigate = useNavigate();

  const permissoesQuery = usePermissoes();

  const permissoes = useMemo(() => permissoesQuery.data ?? [], [permissoesQuery.data]);

  if (permissoesQuery.isLoading) {
    return <Loading />;
  }

  if (permissoesQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar as permissões." />;
  }

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
        <Typography variant="h4">Permissões</Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton
              onClick={() => permissoesQuery.refetch()}
              disabled={permissoesQuery.isFetching}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/permissoes/novo')}
          >
            Nova permissão
          </Button>
        </Box>
      </Box>

      {permissoes.length === 0 ? (
        <EmptyState message="Nenhuma permissão encontrada." />
      ) : (
        <DataTable
          columns={[
            {
              id: 'codigo',
              field: 'codigo' as keyof PermissaoResponse,
              label: 'Código',
            },
            {
              id: 'descricao',
              field: 'descricao' as keyof PermissaoResponse,
              label: 'Descrição',
              renderCell: (permissao: PermissaoResponse) => permissao.descricao || '-',
            },
            {
              id: 'ativo',
              field: 'ativo' as keyof PermissaoResponse,
              label: 'Situação',
              renderCell: (permissao: PermissaoResponse) => (
                <Chip
                  size="small"
                  label={permissao.ativo ? 'Ativa' : 'Inativa'}
                  color={permissao.ativo ? 'success' : 'default'}
                />
              ),
            },
            {
              id: 'acoes',
              label: 'Ações',
              renderCell: (permissao: PermissaoResponse) => (
                <Tooltip title="Editar">
                  <IconButton size="small" onClick={() => navigate(`/permissoes/${permissao.id}`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ),
            },
          ]}
          rows={permissoes}
          emptyMessage="Nenhuma permissão encontrada."
        />
      )}
    </Box>
  );
}
