import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  ToggleOff as ToggleOffIcon,
  ToggleOn as ToggleOnIcon,
} from '@mui/icons-material';

import axios from 'axios';

import { useCategorias, useUpdateCategoria } from '../hooks/useCategorias';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';

import type { CategoriaResponse } from '../types/categorias';

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

  return 'Não foi possível alterar a situação da categoria.';
}

export default function CategoriasListPage() {
  const navigate = useNavigate();

  const categoriasQuery = useCategorias();
  const updateMutation = useUpdateCategoria();

  const [categoriaParaAlterar, setCategoriaParaAlterar] = useState<CategoriaResponse | null>(null);

  const categorias = useMemo(() => categoriasQuery.data ?? [], [categoriasQuery.data]);

  const handleAlterarSituacao = async () => {
    if (!categoriaParaAlterar) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: categoriaParaAlterar.id,
        data: {
          nome: categoriaParaAlterar.nome,
          descricao: categoriaParaAlterar.descricao,
          ativo: !categoriaParaAlterar.ativo,
        },
      });

      setCategoriaParaAlterar(null);
    } catch {
      // O erro é apresentado através do estado da mutação.
    }
  };

  if (categoriasQuery.isLoading) {
    return <Loading />;
  }

  if (categoriasQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar as categorias." />;
  }

  const mutationError = updateMutation.error;

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
        <Typography variant="h4">Categorias</Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton
              onClick={() => categoriasQuery.refetch()}
              disabled={categoriasQuery.isFetching}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/categorias/novo')}
          >
            Nova categoria
          </Button>
        </Box>
      </Box>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity="error" message={getErrorMessage(mutationError)} />
        </Box>
      )}

      {categorias.length === 0 ? (
        <EmptyState message="Nenhuma categoria encontrada." />
      ) : (
        <DataTable
          columns={[
            {
              id: 'nome',
              field: 'nome' as keyof CategoriaResponse,
              label: 'Nome',
            },
            {
              id: 'descricao',
              field: 'descricao' as keyof CategoriaResponse,
              label: 'Descrição',
              renderCell: (categoria: CategoriaResponse) => categoria.descricao || '-',
            },
            {
              id: 'ativo',
              field: 'ativo' as keyof CategoriaResponse,
              label: 'Situação',
              renderCell: (categoria: CategoriaResponse) => (
                <Chip
                  size="small"
                  label={categoria.ativo ? 'Ativa' : 'Inativa'}
                  color={categoria.ativo ? 'success' : 'default'}
                />
              ),
            },
            {
              id: 'acoes',
              label: 'Ações',
              renderCell: (categoria: CategoriaResponse) => (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                  }}
                >
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/categorias/${categoria.id}`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={categoria.ativo ? 'Inativar' : 'Ativar'}>
                    <IconButton
                      size="small"
                      color={categoria.ativo ? 'error' : 'success'}
                      onClick={() => setCategoriaParaAlterar(categoria)}
                      disabled={updateMutation.isPending}
                    >
                      {categoria.ativo ? (
                        <ToggleOffIcon fontSize="small" />
                      ) : (
                        <ToggleOnIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            },
          ]}
          rows={categorias}
          emptyMessage="Nenhuma categoria encontrada."
        />
      )}

      <ConfirmDialog
        open={categoriaParaAlterar !== null}
        title={categoriaParaAlterar?.ativo ? 'Inativar categoria' : 'Ativar categoria'}
        message={
          categoriaParaAlterar
            ? `Deseja realmente ${
                categoriaParaAlterar.ativo ? 'inativar' : 'ativar'
              } a categoria "${categoriaParaAlterar.nome}"?`
            : ''
        }
        onConfirm={handleAlterarSituacao}
        onCancel={() => setCategoriaParaAlterar(null)}
      />

      {updateMutation.isPending && <Loading />}
    </Box>
  );
}
