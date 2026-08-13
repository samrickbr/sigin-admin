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

import { useDeleteMaterial, useMateriais } from '../hooks/useMateriais';

import { DataTable } from '../../../components/table/DataTable/DataTable';
import { Loading } from '../../../components/common/Loading/Loading';
import { EmptyState } from '../../../components/common/EmptyState/EmptyState';
import { Feedback } from '../../../components/common/Feedback/Feedback';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog/ConfirmDialog';

import type { MaterialResponse } from '../types/materiais';

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

  return 'Não foi possível realizar a operação com o material.';
}

export default function MateriaisListPage() {
  const navigate = useNavigate();

  const materiaisQuery = useMateriais();
  const deleteMutation = useDeleteMaterial();

  const [materialParaExcluir, setMaterialParaExcluir] = useState<MaterialResponse | null>(null);

  const materiais = useMemo(() => materiaisQuery.data ?? [], [materiaisQuery.data]);

  const handleExcluir = async () => {
    if (!materialParaExcluir) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(materialParaExcluir.id);
      setMaterialParaExcluir(null);
    } catch {
      // O erro é apresentado através do estado da mutação.
    }
  };

  if (materiaisQuery.isLoading) {
    return <Loading />;
  }

  if (materiaisQuery.isError) {
    return <Feedback severity="error" message="Não foi possível carregar os materiais." />;
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
        <Typography variant="h4">Materiais</Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton
              onClick={() => materiaisQuery.refetch()}
              disabled={materiaisQuery.isFetching}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/materiais/novo')}
          >
            Novo material
          </Button>
        </Box>
      </Box>

      {mutationError && (
        <Box sx={{ mb: 2 }}>
          <Feedback severity="error" message={getErrorMessage(mutationError)} />
        </Box>
      )}

      {materiais.length === 0 ? (
        <EmptyState message="Nenhum material encontrado." />
      ) : (
        <DataTable
          columns={[
            {
              id: 'codigo',
              field: 'codigo' as keyof MaterialResponse,
              label: 'Código',
            },
            {
              id: 'nome',
              field: 'nome' as keyof MaterialResponse,
              label: 'Nome',
            },
            {
              id: 'unidadeMedida',
              field: 'unidadeMedida' as keyof MaterialResponse,
              label: 'Unidade',
            },
            {
              id: 'estoqueMinimo',
              field: 'estoqueMinimo' as keyof MaterialResponse,
              label: 'Estoque mínimo',
            },
            {
              id: 'ativo',
              field: 'ativo' as keyof MaterialResponse,
              label: 'Situação',
              renderCell: (material: MaterialResponse) => (
                <Chip
                  size="small"
                  label={material.ativo ? 'Ativo' : 'Inativo'}
                  color={material.ativo ? 'success' : 'default'}
                />
              ),
            },
            {
              id: 'acoes',
              label: 'Ações',
              renderCell: (material: MaterialResponse) => (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                  }}
                >
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => navigate(`/materiais/${material.id}`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setMaterialParaExcluir(material)}
                      disabled={deleteMutation.isPending}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ),
            },
          ]}
          rows={materiais}
          emptyMessage="Nenhum material encontrado."
        />
      )}

      <ConfirmDialog
        open={materialParaExcluir !== null}
        title="Excluir material"
        message={
          materialParaExcluir
            ? `Deseja realmente excluir o material "${materialParaExcluir.nome}"?`
            : ''
        }
        onConfirm={handleExcluir}
        onCancel={() => setMaterialParaExcluir(null)}
      />

      {deleteMutation.isPending && <Loading />}
    </Box>
  );
}
